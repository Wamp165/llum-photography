import "server-only";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool, types, type CustomTypesConfig } from "pg";
import { databaseSsl, env } from "@/lib/env";

// Better Auth owns the tables user, session, account, verification and rateLimit
// (created by db/migrations/001_initial_schema.sql). Our code never queries them with
// SQL: it goes through `auth.api` / `auth.$context`.
// Pages and Server Actions use src/lib/auth-guard.ts, not this file directly.

declare global {
  // Kept on globalThis so `next dev` hot reloads reuse the same pool.
  var __llumAuthPool: Pool | undefined;
}

// pg returns BIGINT (int8) as a string by default, which breaks Better Auth's
// rate-limit maths on rateLimit.lastRequest. Its values (ms timestamps, counters)
// fit safely in a JS number. Only this pool is affected.
const authTypes: CustomTypesConfig = {
  getTypeParser: ((oid: number, format?: "text" | "binary") =>
    oid === types.builtins.INT8
      ? (value: string) => Number(value)
      : types.getTypeParser(oid, format)) as CustomTypesConfig["getTypeParser"],
};

// Kept low on purpose: every serverless instance opens its own pool against Supabase's
// transaction pooler, which has a small connection limit.
const POOL_MAX_CONNECTIONS = 2;
const POOL_IDLE_TIMEOUT_MS = 10_000;
const POOL_CONNECT_TIMEOUT_MS = 10_000;

function createPool(): Pool {
  const ssl = databaseSsl();
  return new Pool({
    connectionString: env.DATABASE_URL,
    ssl: ssl === false ? false : { rejectUnauthorized: ssl === "verify-full" },
    max: POOL_MAX_CONNECTIONS,
    idleTimeoutMillis: POOL_IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: POOL_CONNECT_TIMEOUT_MS,
    types: authTypes,
  });
}

const pool = globalThis.__llumAuthPool ?? createPool();
globalThis.__llumAuthPool = pool;

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export const auth = betterAuth({
  database: pool,
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",").map((origin) => origin.trim()),

  emailAndPassword: {
    enabled: true,
    // No public sign-up: the only account is created with `npm run admin:create`.
    disableSignUp: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
  },

  session: {
    expiresIn: THIRTY_DAYS,
    // Sliding expiration: refreshed at most once a day while the admin is in use.
    updateAge: 60 * 60 * 24,
  },

  rateLimit: {
    // On in development too, and stored in the database: serverless instances
    // don't share memory.
    enabled: true,
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
    },
  },

  // Must be the last plugin: lets auth calls made from Server Actions set cookies.
  // 2FA (pending): add the `twoFactor` plugin here, see CLAUDE.md.
  plugins: [nextCookies()],
});
