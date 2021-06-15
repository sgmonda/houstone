import Request from "./Request.ts";

export interface TMiddleware {
  (request: Request): Promise<void>;
}
