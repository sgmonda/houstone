import { Request, TMiddleware } from "../../mod.ts";

const MyMiddleware: TMiddleware = async (req: Request): Promise<void> => {
  console.log("REQUEST EN AUTH MIDDLEWARE", req.query);
};

export default MyMiddleware;
