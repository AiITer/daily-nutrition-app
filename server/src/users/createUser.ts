import { db } from "../db.js";

export async function createUser(email: string, passwordHash: string) {
  const result = await db.query(
    `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email, created_at
    `,
    [email, passwordHash],
  );

  return result.rows[0];
}
