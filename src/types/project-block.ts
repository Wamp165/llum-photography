export type TextContent = {
  text: string;
};

export type ImagesContent = {
  images: string[];
};

export type ImageTextContent = {
  image: string;
  text: string;
};

// Must match the project_blocks_type_check constraint in the database.
export type ProjectBlockData =
  | { type: "only_text_center"; content: TextContent }
  | { type: "image_gallery"; content: ImagesContent }
  | { type: "carousel"; content: ImagesContent }
  | { type: "image_left_text_right"; content: ImageTextContent }
  | { type: "image_right_text_left"; content: ImageTextContent }
  | { type: "image_center_text_above"; content: ImageTextContent }
  | { type: "image_center_text_below"; content: ImageTextContent };

export type ProjectBlock = {
  id: number;
  project_id: number;
  position: number;
} & ProjectBlockData;

export type ProjectBlockType = ProjectBlock["type"];

// Raw row from project_blocks, before validation.
export type ProjectBlockRow = {
  id: number;
  project_id: number;
  position: number;
  type: string;
  content: unknown;
};
