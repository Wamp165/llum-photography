// Closed sets of values. These arrays are the source of truth in TypeScript; the
// SQL CHECK constraints must contain exactly the same values (the smoke test
// compares them with pg_constraint).

/** categories.layout — CHECK categories_layout_check */
export const CATEGORY_LAYOUTS = ["editorial", "grid", "masonry", "featured"] as const;

/** project_blocks.type — CHECK project_blocks_type_check */
export const BLOCK_TYPES = [
  "only_text_center",
  "image_gallery",
  "carousel",
  "image_left_text_right",
  "image_right_text_left",
  "image_center_text_above",
  "image_center_text_below",
] as const;

export const MAX_GALLERY_IMAGES = 3;

/** Cloudinary folder for admin uploads. */
export const CLOUDINARY_UPLOAD_FOLDER = "llum";

/** Category slugs are top-level URLs (/<slug>), so these would shadow other routes. */
export const RESERVED_CATEGORY_SLUGS = ["admin", "about", "api", "_next"] as const;
