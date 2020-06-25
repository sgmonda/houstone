import { HttpStatusCode } from "./HttpError.ts";

export default interface Response {
  code?: HttpStatusCode;
  body?: Object;
}
