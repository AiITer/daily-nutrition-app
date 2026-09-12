import { db } from "../db.js";

export async function getProfileByDaySession(daySessionId: number) {
  const result = await db.query(
    `
    SELECT
      p.age,
      p.sex,
      p.height_cm,
      p.weight_kg,
      p.activity_level
    FROM day_sessions d
    JOIN profiles p
      ON p.user_id = d.user_id
    WHERE d.id = $1
    `,
    [daySessionId],
  );

  return result.rows[0] ?? null;
}
