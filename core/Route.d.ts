import Request from "./Request.ts";
import Response from "./Response.d.ts";

export default interface Route {
  (request: Request): Promise<Response>;
}
