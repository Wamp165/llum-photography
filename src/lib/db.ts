import "server-only";
import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;

declare global {
  // Kept on globalThis so `next dev` hot reloads reuse the same pool.
  var __llumSql: Sql | undefined;
}

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1", "[::1]"];

function sslOption(url: string): false | "require" | "prefer" | "verify-full" {
  const value =
    process.env.DATABASE_SSL ||
    (LOCAL_HOSTS.includes(new URL(url).hostname) ? "disable" : "require");

  switch (value) {
    case "disable":
      return false;
    case "require":
    case "prefer":
    case "verify-full":
      return value;
    default:
      throw new Error(
        `Invalid DATABASE_SSL "${value}" (use disable, require, prefer or verify-full)`
      );
  }
}

function createSql(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. See .env.example."
    );
  }

  return postgres(url, {
    ssl: sslOption(url),
    // Supabase's transaction-mode pooler does not support prepared statements.
    prepare: process.env.DATABASE_PREPARE !== "false",
  });
}

export const sql: Sql = globalThis.__llumSql ?? createSql();
globalThis.__llumSql = sql;
