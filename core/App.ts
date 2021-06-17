import { Deno as TDeno } from "../lib.deno.d.ts";
import { http } from "../deps.ts";
import { TMiddleware } from "./TMiddleware.d.ts";
import { Route } from "./Route.d.ts";
import settings from "../settings.ts";
import Request from "./Request.ts";
import { Response } from "./Response.d.ts";
import listFilesTree from "./modules/listFilesTree.ts";
import { HttpError, HttpStatusCode } from "./HttpError.ts";
import getHtml from "./getHtml.tsx";
import { PageProps } from "./mod.ts";
import { Component, State } from "./Component.ts";
import { readFile } from "./modules/index.ts";

const METHODS = ["get", "post", "put", "delete"];
const API_PREFIX = "/api/";
const STATIC_PREFIX = "/static/";

interface Props {
  host?: string;
  port?: number;
}

async function handle(
  req: Request,
  middlewares: TMiddleware[],
  handler: Route | null,
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
  server: TDeno.Server;
  isListening: boolean;
  middlewares: TMiddleware[];
  routes: { [key: string]: Map<RegExp, Route> };
  pages: Map<RegExp, Component<PageProps, State<any>>>;

  async start() {
    const { hostname, port } = this.server.listener.addr;
    console.log(`Server listening at http://${hostname}:${port}`);
    this.isListening = true;
    for await (const httpRequest of this.server) {
      if (!this.isListening) continue;
      this.onRequest(httpRequest);
    }
  }

  async onApiRequest(req: Request) {
    let hand = null;
    for (const [regex, h] of this.routes[req.method].entries()) {
      if (regex.test(req.path)) {
        hand = h;
        break;
      }
    }
    if (!hand) return null;
    const responseContent: Response = {
      code: HttpStatusCode.NO_CONTENT,
      body: undefined,
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
    await req._raw.respond({
      status: responseContent.code,
      headers: responseContent.body &&
        new Headers({ "content-type": "application/json" }),
      body: responseContent.body && JSON.stringify(responseContent.body),
    });
    return true;
  }

  private onPageRequest = (req: Request) => {
    let page = null;
    for (const [regex, h] of this.pages.entries()) {
      if (regex.test(req.path)) {
        page = h;
        break;
      }
    }
    if (!page) return null;
    const pageProps: PageProps = {
      location: {
        url: req.url,
        path: req.path,
        query: req.query,
      },
    };
    console.count('PAGE REQ');
    const { html } = getHtml(page, pageProps);
    console.count('PAGE REQ');
    req._raw.respond({
      status: 200,
      headers: new Headers({ "content-type": "text/html" }),
      body: html,
    });
    return true;
  }

  async onFileRequest(req: Request) {
    const filePath = Deno.cwd() + req.path;
    console.log("STATIC REQUEST", req.path, "=>", filePath);
    try {
      const { file, contentLength, contentType } = await readFile(filePath);
      const headers = new Headers();
      if (contentType) headers.set("content-type", contentType);
      if (contentLength) headers.set("content-length", contentLength);
      req._raw.respond({ status: HttpStatusCode.OK, body: file, headers });
      return true;
    } catch (_) {
      return false;
    }
  }

  async onRequest(httpRequest: TDeno.ServerRequest) {
    const req = new Request(httpRequest);
    let res = null;
    if (req.path === "/bundle.js") {
      // @ts-ignore: I cannot remember why this is needed
      const bundled = await (Deno as any).emit(
        "../core/client.tsx", // @TODO Fix this path. Clients don't have this route
        { bundle: 'module' },
      );
      const js = bundled.files['deno:///bundle.js'];
      console.log('JS', bundled.files['deno:///bundle.js']);
      if (js) {
        const headers = new Headers();
        headers.set("content-type", "application/json");
        req._raw.respond({ status: HttpStatusCode.OK, body: js, headers });
        res = true;
        console.log('JS CODE FOR CLIENT ============\n', js, '\n===========');
      }
    } else if (req.path.startsWith(STATIC_PREFIX)) {
      res = await this.onFileRequest(req);
    } else if (req.path.startsWith(API_PREFIX)) {
      res = await this.onApiRequest(req);
    } else {
      res = await this.onPageRequest(req);
    }
    console.log("RES", res);

    if (!res) {
      await req._raw.respond({
        status: HttpStatusCode.NOT_FOUND,
        // @TODO Beautify 404 errors
      });
    }
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
        const path = name.replace(/^\./g, "").replace(/\.ts$/, "");
        var regex = new RegExp(`^${path}$`);
        if (method in endpoint) {
          console.log(`Importing api endpoint [${method}] ${name}`);
          this.routes[method].set(regex, endpoint[method]);
        }
      }
    }

    // Pages
    const pages = await listFilesTree("./pages");
    for (const [name, path] of Object.entries(pages)) {
      console.log(`Importing page "${name}"`);
      const page = (await import(path as string)).default;
      console.log("PAGE", name, path);
      var regex = new RegExp(
        `^${name.replace(/^\.\/pages/g, "").replace(/\.tsx?$/, "").replace(
          /\/index$/,
          "/",
        )
        }$`,
      );
      this.pages.set(regex, page);
    }
  }

  constructor(props: Props) {
    this.routes = {
      get: new Map(),
      post: new Map(),
      put: new Map(),
      delete: new Map(),
    };
    this.pages = new Map<RegExp, Component<PageProps, State<any>>>();
    this.middlewares = [];
    const { host: hostname = settings.host, port = settings.port } = props;
    this.server = http.serve({ port, hostname });
    this.isListening = false;
    this.createRoutes().then(() => this.start());
  }
}

export default App;
