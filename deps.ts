import * as http from "https://deno.land/std@v0.58.0/http/server.ts";
import * as path from "https://deno.land/std@v0.58.0/path/mod.ts";
import * as colors from "https://deno.land/std@v0.58.0/fmt/colors.ts";

export * from './deps.client.ts';
export { default as ReactDOMServer } from "https://dev.jspm.io/react-dom@16.13.1/server";

export { http, path, colors };
