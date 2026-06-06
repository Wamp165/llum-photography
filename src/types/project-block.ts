export type ProjectBlockType =
  | "image_left_text_right"
  | "image_right_text_left"
  | "image_center_text_below"
  | "image_center_text_above"
  | "three_images"
  | "two_images"
  | "only_image_center"
  | "only_text_center"
  | "carousel";

export type ProjectBlock = {
  id: number;
  project_id: number;
  type: ProjectBlockType;
  content: unknown;
  position: number;
};