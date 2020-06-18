import { TRoute, Request, Response, HttpError } from "../../mod.ts";

export const get: TRoute = async ({ query }: Request): Promise<Response> => {
  const { code, message } = query;
  if (code) throw new HttpError(parseInt(code[0]), message?.[0]);
  throw new Error("This is an unexpected error, like a 3rd party one");
};
