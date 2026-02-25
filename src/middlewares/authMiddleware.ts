import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import BadRequest from "../errors/badRequest";
import type { AuthRequest } from "../types/AppRequest";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.cookie?.split("=")[1];
  if (!token) {
    throw new BadRequest("Unauthorized");
  }
  const verify = jwt.verify(token, process.env.JWT_SECRET!) as any;
  if (!verify) {
    throw new BadRequest("Unauthorized");
  }
  req.user = {
    role: verify.role,
    userId: verify.userId,
  };

  next();
};
