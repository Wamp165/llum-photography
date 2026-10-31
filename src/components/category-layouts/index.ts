import type { ComponentType } from "react";
import type {
  CategoryLayout,
  CategoryLayoutProps,
} from "@/types/category-layout";
import Editorial from "./Editorial";
import Grid from "./Grid";
import Featured from "./Featured";

export const categoryLayouts: Record<
  CategoryLayout,
  ComponentType<CategoryLayoutProps>
> = {
  editorial: Editorial,
  grid: Grid,
  featured: Featured,
};
