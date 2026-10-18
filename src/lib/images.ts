// next/image throws for hosts not listed in images.remotePatterns (next.config.ts).
// Keep both in sync.
const ALLOWED_IMAGE_URL_PREFIX = "https://res.cloudinary.com/";

export function isAllowedImageUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.startsWith(ALLOWED_IMAGE_URL_PREFIX)
  );
}
