import { Request, Middleware } from "../../../mod.ts";

const MyMiddleware: Middleware = async (req: Request): Promise<void> => {
  console.log("REQUEST EN MIDDLEWARE 1", req.query);
};

export default MyMiddleware;
