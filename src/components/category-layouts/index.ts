import type { ComponentType } from "react";
import type {
  CategoryLayout,
  CategoryLayoutProps,
} from "@/types/category-layout";
import Showcase from "./Showcase";
import Grid from "./Grid";
import Carousel from "./Carousel";

export const categoryLayouts: Record<
  CategoryLayout,
  ComponentType<CategoryLayoutProps>
> = {
  showcase: Showcase,
  grid: Grid,
  carousel: Carousel,
};
