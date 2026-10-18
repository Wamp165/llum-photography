import type { ProjectListItem } from "./project-list-item";

// Must match the categories_layout_check constraint in the database.
export type CategoryLayout =
  | "editorial"
  | "grid"
  | "masonry"
  | "featured";

export type CategoryLayoutProps = {
  projects: ProjectListItem[];
};
