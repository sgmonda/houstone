import {
  TRoute,
  Request,
  Response,
  HttpError,
  HttpStatusCode,
} from "../../mod.ts";

export const get: TRoute = async ({
  query: { code, message },
}: Request): Promise<Response> => {
  // If a route promise is rejected, then server responds a proper error
  if (code) {
    throw new HttpError(parseInt(code[0]), message?.[0]);
  }
  console.log("Failure", code, message);
  return { code: HttpStatusCode.NO_CONTENT };
};
