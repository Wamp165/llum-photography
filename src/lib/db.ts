import "server-only";
import postgres from "postgres";
import { databaseSsl, env } from "@/lib/env";

type Sql = ReturnType<typeof postgres>;

declare global {
  // Kept on globalThis so `next dev` hot reloads reuse the same pool.
  var __llumSql: Sql | undefined;
}

// Kept low on purpose: every serverless instance opens its own pool against Supabase's
// transaction pooler, which has a small connection limit.
const POOL_MAX_CONNECTIONS = 3;
const POOL_IDLE_TIMEOUT_SECONDS = 20;
const POOL_CONNECT_TIMEOUT_SECONDS = 10;

function createSql(): Sql {
  return postgres(env.DATABASE_URL, {
    ssl: databaseSsl(),
    max: POOL_MAX_CONNECTIONS,
    idle_timeout: POOL_IDLE_TIMEOUT_SECONDS,
    connect_timeout: POOL_CONNECT_TIMEOUT_SECONDS,
    // Supabase's transaction-mode pooler does not support prepared statements.
    prepare: env.DATABASE_PREPARE !== "false",
  });
}

/** The only database connection of the app. Use it only from src/data/*. */
export const sql: Sql = globalThis.__llumSql ?? createSql();
globalThis.__llumSql = sql;
