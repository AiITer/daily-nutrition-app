import "dotenv/config";
import { db } from "./db.js";
import { createDaySession } from "./days/createDaySession.js";

async function testCreateDaySession() {
  try {
    const daySession = await createDaySession(3, "2026-09-10");

    console.log("Day session:", daySession);
  } catch (error) {
    console.error("Failed to create day session:", error);
  } finally {
    await db.end();
  }
}

testCreateDaySession();
