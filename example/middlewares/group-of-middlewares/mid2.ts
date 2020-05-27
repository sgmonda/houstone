import { Request, TMiddleware } from "../../../mod.ts";

const MyMiddleware: TMiddleware = async (req: Request): Promise<void> => {};

export default MyMiddleware;
