import type { CATEGORY_LAYOUTS } from "@/lib/constants";
import type { ProjectListItem } from "./project-list-item";

export type CategoryLayout = (typeof CATEGORY_LAYOUTS)[number];

/** Props that every component in src/components/category-layouts/ receives. */
export type CategoryLayoutProps = {
  projects: ProjectListItem[];
};
