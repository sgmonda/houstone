import { http } from "./deps.ts";
import Middleware from "./Middleware.ts";
import CustomError from "./CustomError.ts";
import Route from "./Route.ts";
import Deno from "./types/deno.d.ts";
import settings from "./settings.json";
import Request from "./Request.ts";
import listFilesTree from "./modules/listFilesTree.ts";

interface Props {
  host?: string;
  port?: number;
}

export type ResponseData = {
  code?: number;
  body?: { [key: string]: any };
};

async function handle(
  req: Request,
  middlewares: Middleware[],
  handler: Route | null
): Promise<ResponseData> {
  console.log("HANDLE", handler);
  try {
    for await (const middleware of middlewares) {
      await middleware(req);
    }
    if (!handler) return { code: 404 };
    const result = await handler(req);
    return result;
  } catch (e) {
    let code = 500;
    let body = { error: "Internal Server Error" };
    if (e instanceof CustomError) {
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
      if (regex.test(req.path)) hand = h;
    }
    const { code, body } = await handle(req, this.middlewares, hand);
    httpRequest.respond({ status: code, body });
  }

  async stop() {
    this.isListening = false;
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
    const fsTree = await listFilesTree();
    console.log("TREE", fsTree);

    // Middlewares
    for (const [name, path] of Object.entries(fsTree["./middlewares"])) {
      const md = await import(path as string);
      this.middlewares.push(md.default);
    }

    // const cwd = Deno.cwd();
    // console.log("READING DIRS", cwd);
    // for await (const dirEntry of Deno.readDir("/")) {
    //   console.log(dirEntry.name);
    // }
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
