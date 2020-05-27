import { TRoute, Request, Response } from "../../../mod.ts";

const get: TRoute = async (request: Request): Promise<Response> => {
  console.log("GET USER", request);
  return { code: 200, body: { name: "Pepe", dni: "04938374-S" } };
};

const put: TRoute = async (request: Request): Promise<Response> => {
  console.log("UPDATE USER", request);
  return { code: 200, body: { name: "Pepe", dni: "04938374-S" } };
};

export { get, put };
