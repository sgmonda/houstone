import { Route, Request, Response } from "../../mod.ts";

const get: Route = async (request: Request): Promise<Response> => {
  console.log("GET STATUS", request);
  return { code: 200, body: { status: "Up and happy", date: new Date() } };
};

export { get };
