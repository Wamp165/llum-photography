// Applies pending db/migrations/*.sql in order, each in its own transaction.

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const MIGRATIONS_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "db",
  "migrations"
);
const MIGRATION_FILE_PATTERN = /^\d{3}_[a-z0-9_]+\.sql$/;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set (check .env.local).");
  process.exit(1);
}

// Same connection settings as src/lib/db.ts.
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1", "[::1]"];

function sslOption() {
  const value =
    process.env.DATABASE_SSL ||
    (LOCAL_HOSTS.includes(new URL(databaseUrl).hostname) ? "disable" : "require");
  return value === "disable" ? false : value;
}

const sql = postgres(databaseUrl, {
  ssl: sslOption(),
  prepare: process.env.DATABASE_PREPARE !== "false",
  onnotice: () => {},
});

try {
  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ DEFAULT now()
    )
  `;

  const files = (await readdir(MIGRATIONS_DIR)).filter((file) =>
    file.endsWith(".sql")
  );
  const invalid = files.filter((file) => !MIGRATION_FILE_PATTERN.test(file));
  if (invalid.length > 0) {
    throw new Error(
      `Invalid migration file names (expected NNN_description.sql): ${invalid.join(", ")}`
    );
  }
  files.sort();

  const appliedRows = await sql`SELECT name FROM schema_migrations`;
  const applied = new Set(appliedRows.map((row) => row.name));
  const pending = files.filter((file) => !applied.has(file));

  if (pending.length === 0) {
    console.log("No pending migrations.");
  }

  for (const file of pending) {
    const migrationSql = await readFile(path.join(MIGRATIONS_DIR, file), "utf8");

    await sql.begin(async (tx) => {
      await tx.unsafe(migrationSql);
      await tx`INSERT INTO schema_migrations (name) VALUES (${file})`;
    });

    console.log(`Applied: ${file}`);
  }
} catch (error) {
  console.error("Migration failed:", error.message ?? error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
