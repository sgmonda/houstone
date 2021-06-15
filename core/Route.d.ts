import Request from "./Request.ts";
import { Response } from "./Response.d.ts";

export interface Route {
  (request: Request): Promise<Response>;
}
