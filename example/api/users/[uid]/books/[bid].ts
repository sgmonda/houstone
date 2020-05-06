import Denwapp from "../../../../../mod.ts";

const get: Denwapp.Route = async (
  request: Denwapp.Request
): Promise<Denwapp.Response> => {
  console.log("GET BOOK FROM USER", request);
  return { code: 200, body: { name: "Pepe", dni: "04938374-S" } };
};

export { get };
