import "dotenv/config";
import { db } from "./db.js";
import { createFoodEntry } from "./foods/createFoodEntry.js";

async function testCreateFoodEntry() {
  try {
    const foodEntry = await createFoodEntry(
      3,
      "Milk",
      2705413,
      250,
      "mL",
      254.17,
    );

    console.log("Food entry:", foodEntry);
  } catch (error) {
    console.error("Failed to create food entry:", error);
  } finally {
    await db.end();
  }
}

testCreateFoodEntry();
