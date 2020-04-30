import { Route, Request } from "../../../mod.ts";
import { ResponseData } from "../../../App";

const get: Route = async (request: Request): Promise<ResponseData> => {
  console.log("GET USER");
  return { code: 200, body: { name: "Pepe", dni: "04938374-S" } };
};

const put: Route = async (request: Request): Promise<ResponseData> => {
  console.log("UPDATE USER");
  return { code: 200, body: { name: "Pepe", dni: "04938374-S" } };
};

export { get, put };
