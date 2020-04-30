import Request from "./Request.ts";
import { ResponseData } from "./App.ts";

export interface Route {
  (request: Request): Promise<ResponseData>;
}

export default Route;
