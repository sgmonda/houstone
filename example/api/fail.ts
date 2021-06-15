import { HttpError, Request, Response, Route } from "../../mod.ts";

export const get: Route = async ({ query }: Request): Promise<Response> => {
  const { code, message } = query;
  if (code) throw new HttpError(parseInt(code[0]), message?.[0]);
  throw new Error("This is an unexpected error, like a 3rd party one");
};
