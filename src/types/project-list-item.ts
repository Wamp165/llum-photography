import type { Project } from "./project";

export type ProjectListItem =
  Project & {
    category_slug: string;
  };