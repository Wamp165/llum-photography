import type { CategoryLayout } from "@/types/category-layout";

// Allowed values. These arrays are the source of truth: Zod enforces them on
// write and the database does not check them (unknown stored values are handled on read).

/** categories.layout */
export const CATEGORY_LAYOUTS = ["showcase", "grid", "carousel"] as const;

/** project_blocks.type */
export const BLOCK_TYPES = [
  "only_text_center",
  "image_gallery",
  "carousel",
  "image_left_text_right",
  "image_right_text_left",
  "image_center_text_above",
  "image_center_text_below",
] as const;

/** Reads a stored layout: unknown values (e.g. a removed layout) fall back to "showcase". */
export function toCategoryLayout(value: string): CategoryLayout {
  return (CATEGORY_LAYOUTS as readonly string[]).includes(value)
    ? (value as CategoryLayout)
    : "showcase";
}

export const MAX_GALLERY_IMAGES = 5;

/** Cloudinary folder for admin uploads. */
export const CLOUDINARY_UPLOAD_FOLDER = "llum";

/** Category slugs are top-level URLs (/<slug>), so these would shadow other routes. */
export const RESERVED_CATEGORY_SLUGS = ["admin", "about", "api", "_next"] as const;
