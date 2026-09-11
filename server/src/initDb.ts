import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

async function initDb() {
  try {
    await db.query(schema);
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error);
  } finally {
    await db.end();
  }
}

initDb();
