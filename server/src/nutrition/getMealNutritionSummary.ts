import { db } from "../db.js";

type NutrientEntry = {
  nutrientKey: string;
  amount: number;
  unit: string;
};

export async function getMealNutritionSummary(mealSessionId: number) {
  const result = await db.query(
    `
    SELECT nutrients
    FROM food_entries
    WHERE meal_session_id = $1
    `,
    [mealSessionId],
  );

  const totals: Record<
    string,
    {
      nutrientKey: string;
      amount: number;
      unit: string;
    }
  > = {};

  for (const row of result.rows) {
    const nutrients = row.nutrients as NutrientEntry[];

    for (const nutrient of nutrients) {
      if (!totals[nutrient.nutrientKey]) {
        totals[nutrient.nutrientKey] = {
          nutrientKey: nutrient.nutrientKey,
          amount: 0,
          unit: nutrient.unit,
        };
      }

      totals[nutrient.nutrientKey]!.amount += nutrient.amount;
    }
  }

  return Object.values(totals);
}
