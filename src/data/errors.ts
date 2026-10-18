import postgres from "postgres";

// PostgreSQL error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html

/** 23505: e.g. a slug that already exists. */
export function isUniqueViolation(error: unknown): boolean {
  return error instanceof postgres.PostgresError && error.code === "23505";
}

/** 23503: e.g. a category_id that doesn't exist. */
export function isForeignKeyViolation(error: unknown): boolean {
  return error instanceof postgres.PostgresError && error.code === "23503";
}
