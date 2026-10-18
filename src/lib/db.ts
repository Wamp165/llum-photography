import "server-only";
import postgres from "postgres";
import { databaseSsl, env } from "@/lib/env";

type Sql = ReturnType<typeof postgres>;

declare global {
  // Kept on globalThis so `next dev` hot reloads reuse the same pool.
  var __llumSql: Sql | undefined;
}

function createSql(): Sql {
  return postgres(env.DATABASE_URL, {
    ssl: databaseSsl(),
    // Supabase's transaction-mode pooler does not support prepared statements.
    prepare: env.DATABASE_PREPARE !== "false",
  });
}

/** The only database connection of the app. Use it only from src/data/*. */
export const sql: Sql = globalThis.__llumSql ?? createSql();
globalThis.__llumSql = sql;
