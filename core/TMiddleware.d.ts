import Request from "./Request.ts";

export default interface TMiddleware {
  (request: Request): Promise<void>;
}
