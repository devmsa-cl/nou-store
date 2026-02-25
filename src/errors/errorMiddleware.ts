import type { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = (err as { statusCode?: number })?.statusCode || 500;
  const msg = err.message || "Internal Server Error";
  res.status(statusCode).json({
    msg,
  });
};

export default errorMiddleware;
