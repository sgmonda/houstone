import Request from "./Request.ts";

export default interface Middleware {
  (request: Request): Promise<void>;
}
