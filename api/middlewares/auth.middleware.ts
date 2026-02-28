import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

// Interface to add userId to Request
export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const auth = req.headers["authorization"] as string | undefined;
  
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice("Bearer ".length).trim();
    const sub = verifyToken(token);
    if (sub) {
      req.userId = sub;
      return next();
    }
  }

  // Fallback to x-user-id for legacy or default if needed
  // Note: For true "auth", we might want to return 401 if missing,
  // but keeping original behavior for now (default-user)
  req.userId = (req.headers["x-user-id"] as string) || "default-user";
  next();
};

export const getUserId = (req: AuthenticatedRequest) => {
    return req.userId || "default-user";
};
