import "dotenv/config";
import { db } from "./db.js";
import { createFoodEntry } from "./foods/createFoodEntry.js";

async function testCreateFoodEntry() {
  try {
    const foodEntry = await createFoodEntry(
      4,
      "Milk",
      2705413,
      250,
      "mL",
      254.17,
      [
        {
          nutrientKey: "protein",
          amount: 8,
          unit: "g",
        },
        {
          nutrientKey: "calcium",
          amount: 300,
          unit: "mg",
        },
      ],
    );

    console.log("Food entry:", foodEntry);
  } catch (error) {
    console.error("Failed to create food entry:", error);
  } finally {
    await db.end();
  }
}

testCreateFoodEntry();
