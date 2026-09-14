import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

type TokenPayload = {
  userId: number;
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const token = authHeader.slice(7);

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      error: "JWT secret is not configured",
    });
  }

  try {
    const payload = jwt.verify(token, secret) as TokenPayload;

    res.locals.userId = payload.userId;

    next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}
