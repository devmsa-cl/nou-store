import type { Request } from "express";

export interface JSONRequest<T = any> extends Request {
  data?: T;
}

export interface AuthRequest extends JSONRequest {
  user?: { userId: string; role: string };
}
