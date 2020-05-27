import { Request, TMiddleware } from "../../../mod.ts";

const MyMiddleware: TMiddleware = async (req: Request): Promise<void> => {
  console.log("REQUEST EN MIDDLEWARE 1", req.query);
};

export default MyMiddleware;
