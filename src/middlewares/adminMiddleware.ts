import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/AppRequest";
import Unauthorized from "../errors/unauthorized";

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    throw new Unauthorized();
  }
  if (req.user.role !== "admin") {
    throw new Unauthorized("Forbidden");
  }
  next();
};
