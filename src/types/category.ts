import type { CategoryLayout } from "./category-layout";

export type Category = {
  id: number;
  name: string;
  slug: string;
  position: number;
  layout: CategoryLayout;
};
