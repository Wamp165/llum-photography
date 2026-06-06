export type ProjectBlockType =
  | "only_image_center"
  | "only_text_center"
  | "carousel"
  | "image_left_text_right"
  | "image_right_text_left"
  | "image_center_text_above"
  | "image_center_text_below";

export type ProjectBlock = {
  id: number;
  project_id: number;
  type: ProjectBlockType;
  content: unknown;
  position: number;
};