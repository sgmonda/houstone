import Request from "./Request.ts";

export interface Route {
  (request: Request): Promise<{
    code: number;
    body: { [key: string]: any };
  }>;
}

export default Route;
