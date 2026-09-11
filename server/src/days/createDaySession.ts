import { db } from "../db.js";

export async function createDaySession(userId: number, sessionDate: string) {
  const result = await db.query(
    `
    INSERT INTO day_sessions (
      user_id,
      session_date
    )
    VALUES ($1, $2)
    RETURNING *
    `,
    [userId, sessionDate],
  );

  return result.rows[0];
}
