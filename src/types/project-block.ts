import type { z } from "zod";
import type { BLOCK_TYPES } from "@/lib/constants";
import type { storedProjectBlockSchema } from "@/lib/schemas/project-block";

export type BlockType = (typeof BLOCK_TYPES)[number];

/** `type` + `content` of a block (discriminated union, inferred from the Zod schema). */
export type ProjectBlockData = z.infer<typeof storedProjectBlockSchema>;

export type ProjectBlockContent<T extends BlockType> = Extract<
  ProjectBlockData,
  { type: T }
>["content"];

/** A validated block, ready to render. */
export type ProjectBlock = {
  id: number;
  project_id: number;
  position: number;
} & ProjectBlockData;

/** Raw row of project_blocks, before validation. */
export type ProjectBlockRow = {
  id: number;
  project_id: number;
  position: number;
  type: string;
  content: unknown;
};

/** Admin view: invalid rows are kept so they can be seen and deleted. */
export type AdminProjectBlock =
  | { valid: true; block: ProjectBlock }
  | { valid: false; row: ProjectBlockRow; error: string };

/** Content shared by the four "image + text" block types. */
export type ImageTextContent = ProjectBlockContent<"image_left_text_right">;
