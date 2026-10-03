import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL must be set to apply the WF-03 migration");
}

const migrationPath = fileURLToPath(
  new URL("../../../database/migrations/003_wf_03_orchestration.sql", import.meta.url),
);
const migration = await readFile(migrationPath, "utf8");
const pool = new Pool({ connectionString });

try {
  await pool.query(migration);
  console.log("WF-03 migration applied successfully");
} finally {
  await pool.end();
}
