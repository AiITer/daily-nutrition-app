import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, "../migrations");

async function runMigrations() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const appliedResult = await db.query(
    "SELECT filename FROM schema_migrations",
  );

  const applied = new Set(appliedResult.rows.map((row) => row.filename));

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`Skipping ${file}`);
      continue;
    }

    const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");

    const client = await db.connect();

    try {
      await client.query("BEGIN");
      await client.query(sql);

      await client.query(
        "INSERT INTO schema_migrations (filename) VALUES ($1)",
        [file],
      );

      await client.query("COMMIT");

      console.log(`Applied ${file}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  await db.end();

  console.log("Migrations complete");
}

runMigrations().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
