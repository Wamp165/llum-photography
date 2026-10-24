import { z } from "zod";

// Reusable pieces for the schemas in this folder. Safe to import from client code.

/**
 * Images are served through next/image, which only allows the hosts listed in
 * images.remotePatterns (next.config.ts): keep both in sync.
 */
export const cloudinaryImageUrl = z.url({
  protocol: /^https$/,
  hostname: /^res\.cloudinary\.com$/,
  error: "Images must be https://res.cloudinary.com/ URLs.",
});

export function isCloudinaryImageUrl(value: unknown): value is string {
  return cloudinaryImageUrl.safeParse(value).success;
}

// --- Form fields. FormData gives string | File | null; missing fields become "". ---

export const formString = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string()
);

export function requiredText(label: string, max: number) {
  return formString.pipe(
    z
      .string()
      .min(1, `${label} is required.`)
      .max(max, `${label} is too long (max ${max} characters).`)
  );
}

/** Empty → null. */
export function optionalText(label: string, max: number) {
  return formString.pipe(
    z
      .string()
      .max(max, `${label} is too long (max ${max} characters).`)
      .transform((value) => (value === "" ? null : value))
  );
}

// Existing slugs use underscores, new ones hyphens: both are valid.
export const SLUG_PATTERN = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
export const SLUG_MAX_LENGTH = 100;

/** Cheap format check, used by public routes before they query the database. */
export function isSlug(value: string): boolean {
  return value.length <= SLUG_MAX_LENGTH && SLUG_PATTERN.test(value);
}

export const slug = formString.pipe(
  z
    .string()
    .min(1, "Slug is required.")
    .max(SLUG_MAX_LENGTH, `Slug is too long (max ${SLUG_MAX_LENGTH} characters).`)
    .regex(
      SLUG_PATTERN,
      "Use only lowercase letters, numbers and hyphens (e.g. nordic-light)."
    )
);

/** Empty → null. */
export const optionalImageUrl = formString.pipe(
  z.union([z.literal(""), cloudinaryImageUrl]).transform((value) => value || null)
);

/** A hidden input holding JSON (image lists, block content). */
export function jsonField<T extends z.ZodType>(schema: T) {
  return formString.transform((value, ctx) => {
    try {
      return value === "" ? undefined : JSON.parse(value);
    } catch {
      ctx.addIssue({ code: "custom", message: "Invalid data." });
      return z.NEVER;
    }
  }).pipe(schema);
}

/** "YYYY-MM-DD" (a real calendar date) or empty → null. */
export const optionalDate = formString.pipe(
  z
    .union([z.literal(""), z.iso.date({ error: "Enter a valid date." })])
    .transform((value) => value || null)
);

export const optionalEmail = formString.pipe(
  z
    .union([z.literal(""), z.email({ error: "Enter a valid email address." })])
    .transform((value) => value || null)
);

export const positiveId = z.coerce
  .number({ error: "Required." })
  .int()
  .positive("Required.");

export const direction = z.enum(["up", "down"]);

/** First message per field, for showing errors next to each input. */
export function fieldErrorsOf(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] ??= issue.message;
  }
  return fieldErrors;
}
