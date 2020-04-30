import { Request, Middleware } from "../../mod.ts";

const MyMiddleware: Middleware = async (req: Request): Promise<void> => {
  // console.log("REQUEST EN AUTH MIDDLEWARE", req);
};

export default MyMiddleware;
