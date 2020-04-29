import { App, Request } from "../mod.ts";
import config from "./settings.json";

const MyApp = new App(config);

// @TODO Read this automatically from filesystem tree
MyApp.post(/\/hello/, async (req: Request) => {
  return { code: 200, body: { a: 1, b: 2 } };
});

export default MyApp;
