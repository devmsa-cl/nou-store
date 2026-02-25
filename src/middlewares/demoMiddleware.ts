import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/AppRequest";
import Unauthorized from "../errors/unauthorized";

export const demoMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (process.env.DEMO === "true") {
    throw new Unauthorized("Demo mode is enabled");
  }
  next();
};
