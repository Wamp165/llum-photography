// Server-safe: the loader (a "use client" file) and server code both import from here.

const UPLOAD_MARKER = "/image/upload/";

/**
 * Inserts a transformation right after `/image/upload/`. Other URLs are returned unchanged.
 * Always use c_limit (scales down only): photos are never cropped.
 */
export function withCloudinaryTransformation(src: string, transformation: string): string {
  const index = src.indexOf(UPLOAD_MARKER);
  if (!src.startsWith("https://res.cloudinary.com/") || index === -1) return src;

  const start = index + UPLOAD_MARKER.length;
  return `${src.slice(0, start)}${transformation}/${src.slice(start)}`;
}

/** 1200px wide JPEG: the format social networks expect for previews (og:image). */
export function cloudinaryShareImageUrl(src: string): string {
  return withCloudinaryTransformation(src, "c_limit,w_1200,f_jpg,q_auto");
}
