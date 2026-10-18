import { z } from "zod";
import { MAX_GALLERY_IMAGES, type BLOCK_TYPES } from "@/lib/constants";
import { cloudinaryImageUrl, formString, jsonField } from "./common";

// Content of project_blocks rows. `type` decides the shape of `content`.
// Adding a block type: see "Recipe: add a block type" in CLAUDE.md.

const text = z
  .string({ error: "Text is required." })
  .refine((value) => value.trim() !== "", "Text is required.")
  .refine((value) => value.length <= 20000, "Text is too long (max 20000 characters).");

const textContent = z.object({ text });
const imageTextContent = z.object({
  image: cloudinaryImageUrl,
  text,
});

const images = z
  .array(cloudinaryImageUrl, { error: "Add at least one image." })
  .min(1, "Add at least one image.");

/**
 * @param maxGalleryImages limit for image_gallery; undefined = no limit.
 */
function makeProjectBlockSchema(maxGalleryImages: number | undefined) {
  const galleryImages =
    maxGalleryImages === undefined
      ? images
      : images.max(maxGalleryImages, `Use at most ${maxGalleryImages} images.`);

  return z.discriminatedUnion("type", [
    z.object({ type: z.literal("only_text_center"), content: textContent }),
    z.object({ type: z.literal("image_gallery"), content: z.object({ images: galleryImages }) }),
    z.object({ type: z.literal("carousel"), content: z.object({ images }) }),
    z.object({ type: z.literal("image_left_text_right"), content: imageTextContent }),
    z.object({ type: z.literal("image_right_text_left"), content: imageTextContent }),
    z.object({ type: z.literal("image_center_text_above"), content: imageTextContent }),
    z.object({ type: z.literal("image_center_text_below"), content: imageTextContent }),
  ]);
}

/** For saving from the admin (strict: a gallery has 1 to 3 images). */
export const projectBlockSchema = makeProjectBlockSchema(MAX_GALLERY_IMAGES);

/** For reading stored rows (tolerant: never hide content that is already published). */
export const storedProjectBlockSchema = makeProjectBlockSchema(undefined);

/** Block forms send `type` and `content` (JSON in a hidden input). */
export const blockFormSchema = z
  .object({
    type: formString,
    content: jsonField(z.unknown()),
  })
  .pipe(projectBlockSchema);

// Compile-time check: the union above covers exactly BLOCK_TYPES.
type SchemaBlockType = z.infer<typeof storedProjectBlockSchema>["type"];
type BlockTypeMismatch =
  | Exclude<(typeof BLOCK_TYPES)[number], SchemaBlockType>
  | Exclude<SchemaBlockType, (typeof BLOCK_TYPES)[number]>;
const blockTypesMatch: [BlockTypeMismatch] extends [never] ? true : never = true;
void blockTypesMatch;
