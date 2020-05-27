import { TRoute, Request, Response } from "../../mod.ts";

const get: TRoute = async (request: Request): Promise<Response> => {
  console.log("GET STATUS", request);
  return { code: 200, body: { status: "Up and happy", date: new Date() } };
};

export { get };
