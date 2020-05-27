import Request from "./Request.ts";
import Response from "./Response.d.ts";

export default interface TRoute {
  (request: Request): Promise<Response>;
}
