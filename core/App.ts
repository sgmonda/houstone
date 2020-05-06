import Deno from "../deno.d.ts";
import { http } from "../deps.ts";
import Middleware from "./Middleware.d.ts";
import Route from "./Route.d.ts";
import settings from "../settings.json";
import Request from "./Request.ts";
import Response from "./Response.d.ts";
import listFilesTree from "./modules/listFilesTree.ts";

const METHODS = ["get", "post", "put", "delete"];

interface Props {
  host?: string;
  port?: number;
}

async function handle(
  req: Request,
  middlewares: Middleware[],
  handler: Route | null
): Promise<Response> {
  try {
    for await (const middleware of middlewares) {
      console.log("CALLING MIDDLEWARE", middleware);
      await middleware(req);
    }
    if (!handler) return { code: 404 };
    const result = await handler(req);
    return result;
  } catch (e) {
    let code = 500;
    let body = { error: "Internal Server Error" };
    if (e.code && e.body) {
      console.log("Handled Error", e.code, e);
      code = e.code;
      body.error = e.error.message;
    } else {
      console.error("Unhandled Error", e, e.trace);
    }
    return { code, body };
  }
}

class App {
  server: Deno.Server;
  isListening: boolean;
  middlewares: Middleware[];
  routes: { [key: string]: Map<RegExp, Route> };

  async start() {
    const { hostname, port } = this.server.listener.addr;
    console.log(`Server listening at http://${hostname}:${port}`);
    this.isListening = true;
    for await (const httpRequest of this.server) {
      if (!this.isListening) continue;
      this.onRequest(httpRequest);
    }
  }

  async onRequest(httpRequest: Deno.ServerRequest) {
    const req = new Request(httpRequest);
    let hand = null;
    for (const [regex, h] of this.routes[req.method].entries()) {
      console.log("CHECK ROUTE REGEX", regex, req.method, req.path);
      if (regex.test(req.path)) hand = h;
    }
    const { code, body } = await handle(req, this.middlewares, hand);
    httpRequest.respond({ status: code, body });
  }

  async pause() {
    this.isListening = false;
  }

  async resume() {
    this.isListening = true;
  }

  get(reg: RegExp, handler: Route) {
    this.routes["get"].set(reg, handler);
  }

  post(reg: RegExp, handler: Route) {
    this.routes["post"].set(reg, handler);
  }

  put(reg: RegExp, handler: Route) {
    this.routes["put"].set(reg, handler);
  }

  delete(reg: RegExp, handler: Route) {
    this.routes["delete"].set(reg, handler);
  }

  async createRoutes() {
    // Middlewares
    const middlewares = await listFilesTree("./middlewares");
    for (const [name, path] of Object.entries(middlewares)) {
      // @TODO Sort Middlewares. Alphabetically? Sometimes a middleware depends on others. Auth use to be the first one
      console.log(`Importing middleware "${name}"`);
      const md = await import(path as string);
      this.middlewares.push(md.default);
    }

    // API
    const endpoints = await listFilesTree("./api");
    for (const [name, path] of Object.entries(endpoints)) {
      console.log(`Importing api endpoint "${name}"`);
      const endpoint = await import(path as string);
      for (const method of METHODS) {
        var regex = new RegExp(name.replace(/^\./g, "").replace(/\.ts$/, ""));
        if (method in endpoint) {
          console.log(`Importing api endpoint [${method}] ${name}`);
          this.routes[method].set(regex, endpoint.method);
        }
      }
    }
  }

  constructor(props: Props) {
    this.routes = {
      get: new Map(),
      post: new Map(),
      put: new Map(),
      delete: new Map(),
    };
    this.middlewares = [];
    const { host: hostname = settings.host, port = settings.port } = props;
    this.server = http.serve({ port, hostname });
    this.isListening = false;
    this.createRoutes().then(() => this.start());
  }
}

export default App;
