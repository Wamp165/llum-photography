"use client";

import type { ImageLoaderProps } from "next/image";

// next/image loader (configured in next.config.ts): Cloudinary's CDN resizes the
// photo instead of the Next.js server downloading multi-MB originals and resizing
// them itself, which was slow and timed out with many images on a page.
//
// c_limit only scales DOWN and keeps the aspect ratio: photos are never cropped.
// f_auto / q_auto let Cloudinary pick the best format (WebP/AVIF) and quality.

const UPLOAD_MARKER = "/image/upload/";

export default function cloudinaryLoader({ src, width }: ImageLoaderProps): string {
  const index = src.indexOf(UPLOAD_MARKER);
  if (!src.startsWith("https://res.cloudinary.com/") || index === -1) return src;

  const start = index + UPLOAD_MARKER.length;
  return `${src.slice(0, start)}f_auto,q_auto,c_limit,w_${width}/${src.slice(start)}`;
}
