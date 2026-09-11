import "dotenv/config";
import { db } from "./db.js";

async function createTestUser() {
  try {
    const result = await db.query(
      `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, created_at
      `,
      ["test@example.com", "temporary_hash"],
    );

    console.log(result.rows[0]);
  } catch (error) {
    console.error("Failed to create test user:", error);
  } finally {
    await db.end();
  }
}

createTestUser();
