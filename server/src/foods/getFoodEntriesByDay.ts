import { db } from "../db.js";

export async function getFoodEntriesByDay(daySessionId: number) {
  const result = await db.query(
    `
    SELECT *
    FROM food_entries
    WHERE day_session_id = $1
    ORDER BY created_at ASC
    `,
    [daySessionId],
  );

  return result.rows;
}
