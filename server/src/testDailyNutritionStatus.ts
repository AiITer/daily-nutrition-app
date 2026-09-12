import "dotenv/config";
import { db } from "./db.js";
import { getDailyNutritionStatus } from "./nutrition/getDailyNutritionStatus.js";

async function testDailyNutritionStatus() {
  try {
    const profile = {
      age: 35,
      sex: "female" as const,
      heightCm: 165,
      weightKg: 60,
      activityLevel: "active" as const,
    };

    const result = await getDailyNutritionStatus(4, profile);

    console.log(result);
  } catch (error) {
    console.error("Failed to get daily nutrition status:", error);
  } finally {
    await db.end();
  }
}

testDailyNutritionStatus();
