import type { ComponentType } from "react";
import { MAX_GALLERY_IMAGES } from "@/lib/constants";
import type { BlockType, ProjectBlockContent } from "@/types/project-block";
import ImagesBlockFields from "./ImagesBlockFields";
import ImageTextBlockFields from "./ImageTextBlockFields";
import TextBlockFields from "./TextBlockFields";

/**
 * Props of every block form. A form renders its inputs plus a hidden input named
 * "content" with the block content as JSON; the Server Action validates it with
 * blockFormSchema (src/lib/schemas/project-block.ts).
 */
export type BlockFieldsProps<T extends BlockType> = {
  /** Current content when editing, null when adding a new block. */
  initial: ProjectBlockContent<T> | null;
};

type BlockFormEntry<T extends BlockType> = {
  label: string;
  Fields: ComponentType<BlockFieldsProps<T>>;
};

function GalleryBlockFields({ initial }: BlockFieldsProps<"image_gallery">) {
  return <ImagesBlockFields initial={initial} max={MAX_GALLERY_IMAGES} />;
}

function CarouselBlockFields({ initial }: BlockFieldsProps<"carousel">) {
  return <ImagesBlockFields initial={initial} />;
}

// One entry per block type (a Record over BlockType): adding a type to
// BLOCK_TYPES without a form here is a compile error.
export const blockForms: { [T in BlockType]: BlockFormEntry<T> } = {
  only_text_center: { label: "Text", Fields: TextBlockFields },
  image_gallery: { label: "Gallery (1–3 images side by side)", Fields: GalleryBlockFields },
  carousel: { label: "Carousel", Fields: CarouselBlockFields },
  image_left_text_right: { label: "Image left, text right", Fields: ImageTextBlockFields },
  image_right_text_left: { label: "Text left, image right", Fields: ImageTextBlockFields },
  image_center_text_above: { label: "Text above, image centered", Fields: ImageTextBlockFields },
  image_center_text_below: { label: "Image centered, text below", Fields: ImageTextBlockFields },
};

export function BlockFields<T extends BlockType>({
  type,
  initial,
}: {
  type: T;
  initial: ProjectBlockContent<T> | null;
}) {
  const { Fields } = blockForms[type];
  return <Fields initial={initial} />;
}
