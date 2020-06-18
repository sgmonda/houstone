import Deno from "../deno.d.ts";
import { http } from "../deps.ts";
import TMiddleware from "./TMiddleware.d.ts";
import TRoute from "./TRoute.d.ts";
import settings from "../settings.ts";
import Request from "./Request.ts";
import Response, { ResponseBody } from "./Response.d.ts";
import listFilesTree from "./modules/listFilesTree.ts";
import { HttpStatusCode, HttpError } from "./HttpError.ts";

const METHODS = ["get", "post", "put", "delete"];

interface Props {
  host?: string;
  port?: number;
}

async function handle(
  req: Request,
  middlewares: TMiddleware[],
  handler: TRoute | null
): Promise<Response> {
  if (!handler) return { code: 404 };
  try {
    for await (const middleware of middlewares) {
      await middleware(req);
    }
    return handler(req);
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
  middlewares: TMiddleware[];
  routes: { [key: string]: Map<RegExp, TRoute> };

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
      if (regex.test(req.path)) {
        hand = h;
        break;
      }
    }
    const responseContent = {
      code: HttpStatusCode.NO_CONTENT,
      body: null as ResponseBody | null,
    };
    try {
      Object.assign(responseContent, await handle(req, this.middlewares, hand));
    } catch (err) {
      if (err instanceof HttpError) {
        responseContent.code = err.code;
        if (err.message) responseContent.body = { error: err.message };
      } else {
        Object.assign(responseContent, {
          code: HttpStatusCode.INTERNAL_SERVER_ERROR,
          body: { error: "Internal Server Error" }, // @TODO Define these messages in an object
        });
      }
    }
    // usage.push(req);
    await httpRequest.respond({
      status: responseContent.code,
      headers:
        responseContent.body &&
        new Headers({ "content-type": "application/json" }),
      body: responseContent.body && JSON.stringify(responseContent.body),
    });
  }

  async pause() {
    this.isListening = false;
  }

  async resume() {
    this.isListening = true;
  }

  get(reg: RegExp, handler: TRoute) {
    this.routes["get"].set(reg, handler);
  }

  post(reg: RegExp, handler: TRoute) {
    this.routes["post"].set(reg, handler);
  }

  put(reg: RegExp, handler: TRoute) {
    this.routes["put"].set(reg, handler);
  }

  delete(reg: RegExp, handler: TRoute) {
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
        const path = name.replace(/^\./g, "").replace(/\.ts$/, "");
        var regex = new RegExp(`^${path}$`);
        if (method in endpoint) {
          console.log(`Importing api endpoint [${method}] ${name}`);
          this.routes[method].set(regex, endpoint[method]);
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
