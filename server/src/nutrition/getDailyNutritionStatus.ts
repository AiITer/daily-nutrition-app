import { getDailyNutritionSummary } from "./getDailyNutritionSummary.js";
import { getDailyTarget } from "./getDailyTarget.js";
import { compareIntakeToTarget } from "./compareIntakeToTarget.js";

type Profile = {
  age: number;
  sex: "female" | "male";
  heightCm: number;
  weightKg: number;
  activityLevel: "inactive" | "lowActive" | "active" | "veryActive";
};

export async function getDailyNutritionStatus(
  daySessionId: number,
  profile: Profile,
) {
  const dailyIntake = await getDailyNutritionSummary(daySessionId);

  return dailyIntake.map((item) => {
    const target = getDailyTarget(item.nutrientKey, profile);

    return compareIntakeToTarget(item, target);
  });
}
