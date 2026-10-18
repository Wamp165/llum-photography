import type { ImageLoaderProps } from "next/image";

const UPLOAD_SEGMENT = "/image/upload/";

// Cloudinary resizes and picks the format (AVIF/WebP) on its CDN, so images
// never go through the Next.js image optimizer.
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  const index = src.indexOf(UPLOAD_SEGMENT);

  if (index === -1) {
    return src;
  }

  // c_limit only shrinks: an image narrower than `width` is never upscaled.
  const transformations = [
    "f_auto",
    "c_limit",
    `w_${width}`,
    `q_${quality ?? "auto"}`,
  ].join(",");

  const start = index + UPLOAD_SEGMENT.length;

  return `${src.slice(0, start)}${transformations}/${src.slice(start)}`;
}
