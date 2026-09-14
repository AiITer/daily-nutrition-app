import bcrypt from "bcrypt";
import { db } from "../db.js";

export async function loginUser(email: string, password: string) {
  const result = await db.query(
    `
    SELECT id, email, password_hash, created_at
    FROM users
    WHERE email = $1
    `,
    [email],
  );

  const user = result.rows[0];

  if (!user) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
  };
}
