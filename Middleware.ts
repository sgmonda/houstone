import Request from "./Request.ts";

export type MiddlewareResponse = undefined | { [key: string]: any };

interface Middleware {
  (request: Request, state: { [key: string]: any }): Promise<
    MiddlewareResponse
  >;
}

export default Middleware;
