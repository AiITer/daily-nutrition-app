import "dotenv/config";
import { db } from "./db.js";
import { getFoodEntriesByDay } from "./foods/getFoodEntriesByDay.js";

async function testGetFoodEntries() {
  try {
    const entries = await getFoodEntriesByDay(4);
    console.log("Food entries:", entries);
  } catch (error) {
    console.error("Failed to get food entries:", error);
  } finally {
    await db.end();
  }
}

testGetFoodEntries();
