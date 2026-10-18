import "server-only";
import { z } from "zod";

// Server environment, validated once at startup (see src/instrumentation.ts).
// Document every variable in .env.example and CLAUDE.md.

// `FOO=` in .env files arrives as "": treat it as "not set".
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema.optional());

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .regex(/^postgres(ql)?:\/\//, "must be a postgres:// or postgresql:// URL"),
  DATABASE_SSL: optional(z.enum(["disable", "require", "prefer", "verify-full"])),
  DATABASE_PREPARE: optional(z.enum(["true", "false"])),

  BETTER_AUTH_SECRET: z.string().min(32, "must be at least 32 characters (openssl rand -base64 32)"),
  BETTER_AUTH_URL: z.url(),
  /** Extra origins allowed to call the auth API, comma-separated (e.g. a LAN IP in dev). */
  BETTER_AUTH_TRUSTED_ORIGINS: optional(z.string()),

  // Cloudinary uploads are optional: without all three, pasting URLs still works.
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: optional(z.string()),
  NEXT_PUBLIC_CLOUDINARY_API_KEY: optional(z.string()),
  CLOUDINARY_API_SECRET: optional(z.string()),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid environment variables (see .env.example):\n${problems}`
    );
  }
  return result.data;
}

export const env = parseEnv();

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1", "[::1]"];

/** SSL mode for both connections (postgres and pg): off for localhost unless set. */
export function databaseSsl(): false | "require" | "prefer" | "verify-full" {
  const mode =
    env.DATABASE_SSL ??
    (LOCAL_HOSTS.includes(new URL(env.DATABASE_URL).hostname) ? "disable" : "require");
  return mode === "disable" ? false : mode;
}

export function isCloudinaryUploadEnabled(): boolean {
  return Boolean(
    env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      env.NEXT_PUBLIC_CLOUDINARY_API_KEY &&
      env.CLOUDINARY_API_SECRET
  );
}
