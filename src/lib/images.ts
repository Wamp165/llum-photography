// The image loader (src/lib/cloudinary-loader.ts) only knows how to resize Cloudinary
// URLs, and images.remotePatterns (next.config.ts) lists the same host. Keep all in sync.
const ALLOWED_IMAGE_URL_PREFIX = "https://res.cloudinary.com/";

export function isAllowedImageUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.startsWith(ALLOWED_IMAGE_URL_PREFIX)
  );
}
