import { Deno } from "./types/deno.d.ts";

export type Query = {
  [key: string]: string[];
};

export type Params = {
  [key: string]: string | number;
};

export type RequestState = Map<any, any>;

function parseQuery(url: string): Query {
  const query: Query = {};
  const urlParams = new URLSearchParams(url.replace(/^.+\?/, ""));
  for (const entry of urlParams.entries()) {
    query[entry[0]] = query[entry[0]] || [];
    query[entry[0]].push(entry[1]);
    console.log(`${entry[0]}: ${entry[1]}`);
  }
  return query;
}

function parseUrl(url: string): { path: string; query: Query; params: Params } {
  const params: Params = {};
  // @TODO Parse params
  return {
    path: url.replace(/\?.+$/, ""),
    query: parseQuery(url),
    params,
  };
}

// async function parseMultipart(): Promise<any> {}
// async function parseJson(): Promise<any> {}

// async function parseBody(type: string, reader: Deno.BufReader): Promise<any> {
//   const parsers = {
//     "multipart/form-data": parseMultipart,
//     "application/json": parseJson,
//     // @TODO Support more types
//   };
//   if (!parsers[type]) return null;

//   const rawBody = {};
//   return parsers[type](rawBody);
// }

class Request {
  headers: Headers;
  method: string;
  path: string;
  query: Query;
  params: Params;
  state: RequestState;
  // files: Deno.File[];
  // body: any;
  _raw: Deno.ServerRequest;

  constructor(httpRequest: Deno.ServerRequest) {
    this.method = httpRequest.method.toLowerCase();
    this.state = new Map();
    this.headers = httpRequest.headers;

    const { path, query, params } = parseUrl(httpRequest.url);
    this.path = path;
    this.query = query;
    this.params = params;
    console.log("PARSE PATH", path);
    console.log("PARSE QUERY", query);
    console.log("PARSE PARAMS", params);
    // this.body = await parseBody(this.headers.ContentType, httpRequest.r);
    this._raw = httpRequest;
  }
}

export default Request;
