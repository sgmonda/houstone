import Request from "./Request.ts";

export interface Route {
  (request: Request, state: { [key: string]: any }): Promise<{
    code: number;
    body: { [key: string]: any };
  }>;
}

export default Route;
