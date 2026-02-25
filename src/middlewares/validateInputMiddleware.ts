import { z } from "zod";
import BadRequest from "../errors/badRequest";
import type { NextFunction, Request } from "express";
export const validateInputMiddleware = (schema: z.ZodObject) => {
  return (req: any, _: any, next: NextFunction) => {
    const r = schema.safeParse(req.body);
    if (!r.success) {
      return next(new BadRequest(r.error.issues[0]?.message)); // new BadRequest
    }
    req.data = r.data;
    next();
  };
};
