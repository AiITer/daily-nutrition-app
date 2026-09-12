import { db } from "../db.js";

type NutrientIntake = {
  nutrientKey: string;
  amount: number;
  unit: string;
};

export async function getDailyNutritionSummary(daySessionId: number) {
  const result = await db.query(
    `
    SELECT nutrients
    FROM food_entries
    WHERE day_session_id = $1
    `,
    [daySessionId],
  );

  const totals: Record<
    string,
    { nutrientKey: string; amount: number; unit: string }
  > = {};

  for (const row of result.rows) {
    const nutrients = row.nutrients as NutrientIntake[];

    for (const nutrient of nutrients) {
      const key = nutrient.nutrientKey;

      if (!totals[key]) {
        totals[key] = {
          nutrientKey: key,
          amount: 0,
          unit: nutrient.unit,
        };
      }

      totals[key]!.amount += nutrient.amount;
    }
  }

  return Object.values(totals);
}
