import { http } from "./deps.ts";
import Middleware from "./Middleware.ts";
import CustomError from "./CustomError.ts";
import Route from "./Route.ts";
import Deno from "./types/deno.d.ts";

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
  console.log("HANDLE", req);
  try {
    const state = {};
    for await (const middleware of middlewares) {
      await middleware(req, state);
    }
    if (!handler) return { code: 404 };
    const result = await handler(req, state);
    return result;
  } catch (e) {
    let code = 500;
    let body = { message: "Internal Server Error" };
    if (e instanceof CustomError) {
      console.log("Handled Error", e.code, e.error);
    } else {
      console.error("Unhandled Error", e);
      code = 500;
      body.message = "Internal Server Error";
    }
    return { code, body };
  }
}

class App {
  server: Deno.Server;
  isListening: boolean;
  routes: { [key: string]: Map<RegExp, Route> };

  async start() {
    console.log("SERVER RUNNING AT", this.server);
    this.isListening = true;
    for await (const httpRequest of this.server) {
      if (this.isListening) break;
      this.onRequest(httpRequest);
    }
  }

  async onRequest(httpRequest: Deno.ServerRequest) {
    const req = new Request(httpRequest);
    let hand = null;
    for (const [regex, h] of this.routes[req.method].entries()) {
      if (regex.test(req.url)) hand = h;
    }
    const { code, body } = await handle(req, [], hand);
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

  constructor(props: Props) {
    this.routes = {
      get: new Map(),
      post: new Map(),
      put: new Map(),
      delete: new Map(),
    };
    console.log("APP PROPS", props);
    const { host = "http://localhost", port } = props;
    const address = `${props.host}:${props.port}`;
    this.server = http.serve(address);
    this.isListening = false;
  }
}

export default App;
