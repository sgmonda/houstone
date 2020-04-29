import { Deno } from "./types/deno.d.ts";

export interface Props {}

export type RequestState = Map<any, any>;

class Request {
  method: string;
  url: string;
  state: RequestState;
  constructor(httpRequest: Deno.ServerRequest) {
    console.log("NEW REQ", httpRequest);
    this.method = httpRequest.method;
    this.url = httpRequest.url;
    this.state = new Map();
  }
}

export default Request;
