import Request from "./Request.ts";

interface Middleware {
  (request: Request): Promise<void>;
}

export default Middleware;
