import { Request, Response, Route } from "../../mod.ts";

export const get: Route = async (request: Request): Promise<Response> => {
  console.log("GET STATUS", request);
  return { code: 200, body: { status: "Up and happy", date: new Date() } };
};
