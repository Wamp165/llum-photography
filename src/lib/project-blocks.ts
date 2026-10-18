import { isAllowedImageUrl } from "@/lib/images";
import type {
  ImagesContent,
  ImageTextContent,
  ProjectBlockData,
  ProjectBlockType,
  TextContent,
} from "@/types/project-block";

export type BlockValidationResult =
  | { ok: true; block: ProjectBlockData }
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isNonEmptyText(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function validateTextContent(content: unknown): TextContent | string {
  if (!isRecord(content)) return "content must be an object";
  if (!isNonEmptyText(content.text)) return "text must be a non-empty string";
  return { text: content.text };
}

function validateImagesContent(content: unknown): ImagesContent | string {
  if (!isRecord(content)) return "content must be an object";
  const images = content.images;
  if (!Array.isArray(images) || images.length === 0) {
    return "images must be a non-empty array";
  }
  const urls: string[] = [];
  for (const image of images) {
    if (!isAllowedImageUrl(image)) {
      return `invalid image URL: ${JSON.stringify(image)}`;
    }
    urls.push(image);
  }
  return { images: urls };
}

function validateImageTextContent(
  content: unknown
): ImageTextContent | string {
  if (!isRecord(content)) return "content must be an object";
  if (!isAllowedImageUrl(content.image)) {
    return `invalid image URL: ${JSON.stringify(content.image)}`;
  }
  if (!isNonEmptyText(content.text)) return "text must be a non-empty string";
  return { image: content.image, text: content.text };
}

type ValidatorFor<T extends ProjectBlockType> = (
  content: unknown
) => Extract<ProjectBlockData, { type: T }> | string;

const validators: { [T in ProjectBlockType]: ValidatorFor<T> } = {
  only_text_center: (content) => {
    const result = validateTextContent(content);
    return typeof result === "string"
      ? result
      : { type: "only_text_center", content: result };
  },
  image_gallery: (content) => {
    const result = validateImagesContent(content);
    return typeof result === "string"
      ? result
      : { type: "image_gallery", content: result };
  },
  carousel: (content) => {
    const result = validateImagesContent(content);
    return typeof result === "string"
      ? result
      : { type: "carousel", content: result };
  },
  image_left_text_right: (content) => {
    const result = validateImageTextContent(content);
    return typeof result === "string"
      ? result
      : { type: "image_left_text_right", content: result };
  },
  image_right_text_left: (content) => {
    const result = validateImageTextContent(content);
    return typeof result === "string"
      ? result
      : { type: "image_right_text_left", content: result };
  },
  image_center_text_above: (content) => {
    const result = validateImageTextContent(content);
    return typeof result === "string"
      ? result
      : { type: "image_center_text_above", content: result };
  },
  image_center_text_below: (content) => {
    const result = validateImageTextContent(content);
    return typeof result === "string"
      ? result
      : { type: "image_center_text_below", content: result };
  },
};

export function isProjectBlockType(
  value: string
): value is ProjectBlockType {
  return Object.hasOwn(validators, value);
}

// Use this both when reading blocks and before saving them from the admin.
export function validateProjectBlock(
  type: string,
  content: unknown
): BlockValidationResult {
  if (!isProjectBlockType(type)) {
    return { ok: false, error: `unknown block type: ${type}` };
  }

  const result = validators[type](content);
  return typeof result === "string"
    ? { ok: false, error: `${type}: ${result}` }
    : { ok: true, block: result };
}
