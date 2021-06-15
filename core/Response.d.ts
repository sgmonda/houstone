import { HttpStatusCode } from "./HttpError.ts";

export interface Response {
  code?: HttpStatusCode;
  body?: Object;
}
