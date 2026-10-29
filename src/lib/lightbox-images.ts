"use client";

import { getImageProps } from "next/image";
import { SIZES_LIGHTBOX } from "./image-sizes";

// The full-screen viewer asks Cloudinary for a bigger variant than the page does, and
// Cloudinary generates it on the first request (1-2 s). These helpers hide that wait.

/** Intrinsic size hint of the viewer image (only the ratio matters; the file is chosen by `sizes`). */
export const LIGHTBOX_IMAGE_WIDTH = 2000;
export const LIGHTBOX_IMAGE_HEIGHT = 1333;

const preloaded = new Set<string>();
const shown = new Map<string, string>();

/** Starts downloading the viewer variant of a photo, using the same srcset as the viewer itself. */
export function preloadLightboxImage(src: string): void {
  if (typeof window === "undefined" || preloaded.has(src)) return;
  preloaded.add(src);

  const { props } = getImageProps({
    src,
    alt: "",
    width: LIGHTBOX_IMAGE_WIDTH,
    height: LIGHTBOX_IMAGE_HEIGHT,
    sizes: SIZES_LIGHTBOX,
  });
  const image = new window.Image();
  image.sizes = SIZES_LIGHTBOX;
  image.srcset = props.srcSet ?? "";
  image.src = props.src;
}

/** Remembers the exact URL the page loaded for a photo, which is already in the browser cache. */
export function rememberShownUrl(src: string, loadedUrl: string): void {
  if (loadedUrl) shown.set(src, loadedUrl);
}

/** The variant the page already loaded for a photo, if any: a placeholder while the big one arrives. */
export function shownUrlOf(src: string): string | undefined {
  return shown.get(src);
}
