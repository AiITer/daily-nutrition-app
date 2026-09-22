import { db } from "../db.js";
import { getDailyTarget } from "./getDailyTarget.js";
import { compareIntakeToTarget } from "./compareIntakeToTarget.js";

type NutrientEntry = {
  nutrientKey: string;
  amount: number;
  unit: string;
};

type Profile = {
  age: number;
  sex: "female" | "male";
  heightCm: number;
  weightKg: number;
  activityLevel: "inactive" | "lowActive" | "active" | "veryActive";
};

export async function getNutritionStatusThroughMeal(
  mealSessionId: number,
  profile: Profile,
) {
  const mealResult = await db.query(
    `
    SELECT
      id,
      day_session_id,
      created_at
    FROM meal_sessions
    WHERE id = $1
    `,
    [mealSessionId],
  );

  const currentMeal = mealResult.rows[0];

  if (!currentMeal) {
    return null;
  }

  const foodResult = await db.query(
    `
  SELECT food_entries.nutrients
  FROM food_entries
  JOIN meal_sessions
    ON food_entries.meal_session_id = meal_sessions.id
  WHERE meal_sessions.day_session_id = $1
    AND meal_sessions.id <= $2
  `,
    [currentMeal.day_session_id, currentMeal.id],
  );

  console.log("currentMeal:", currentMeal);
  console.log("food rows through meal:", foodResult.rows);

  const totals: Record<
    string,
    {
      nutrientKey: string;
      amount: number;
      unit: string;
    }
  > = {};

  for (const row of foodResult.rows) {
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

  const consumed = Object.values(totals);

  return consumed.map((item) => {
    const target = getDailyTarget(item.nutrientKey, profile);

    return compareIntakeToTarget(item, target);
  });
}