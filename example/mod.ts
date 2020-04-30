import { App, Request } from "../mod.ts";
import config from "./settings.json";

const MyApp = new App(config);

// @TODO Read this automatically from filesystem tree
MyApp.get(/\/hello/, async (req: Request) => {
  console.log("SOY EL HANDLER de hello");
  return { code: 200, body: { a: 1, b: 2 } };
});

export default MyApp;
