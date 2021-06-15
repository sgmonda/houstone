import { Request, Response, Route } from "../../../../../mod.ts";

const get: Route = async (request: Request): Promise<Response> => {
  console.log("GET BOOK FROM USER", request);
  return { code: 200, body: { name: "Pepe", dni: "04938374-S" } };
};

export { get };
