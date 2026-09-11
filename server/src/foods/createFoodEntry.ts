import { db } from "../db.js";

export async function createFoodEntry(
  daySessionId: number,
  foodName: string,
  fdcId: number | null,
  amount: number,
  unit: string,
  grams: number,
) {
  const result = await db.query(
    `
    INSERT INTO food_entries (
      day_session_id,
      food_name,
      fdc_id,
      amount,
      unit,
      grams
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [daySessionId, foodName, fdcId, amount, unit, grams],
  );

  return result.rows[0];
}
