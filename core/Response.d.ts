import { HttpStatusCode } from "./HttpError.ts";

export type ResponseBody = { [key: string]: any };

export default interface Response {
  code?: HttpStatusCode;
  body?: ResponseBody;
}
