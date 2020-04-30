import { Request, Middleware } from "../../../mod.ts";

const MyMiddleware: Middleware = async (req: Request): Promise<void> => {};

export default MyMiddleware;
