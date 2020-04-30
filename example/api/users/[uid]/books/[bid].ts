import { Route, Request } from "../../../../../mod.ts";
import { ResponseData } from "../../../../../App.ts";

const get: Route = async (request: Request): Promise<ResponseData> => {
  console.log("GET BOOK FROM USER");
  return { code: 200, body: { name: "Pepe", dni: "04938374-S" } };
};

export { get };
