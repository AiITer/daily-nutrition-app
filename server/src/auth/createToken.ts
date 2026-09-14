import jwt from "jsonwebtoken";

export function createToken(userId: number) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT secret is not configured");
  }

  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}
