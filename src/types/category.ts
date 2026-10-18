import type { z } from "zod";
import type { categoryFormSchema } from "@/lib/schemas/category";
import type { CategoryLayout } from "./category-layout";

/** Row of `categories`. */
export type Category = {
  id: number;
  name: string;
  slug: string;
  position: number;
  layout: CategoryLayout;
};

export type CategoryWithProjectCount = Category & {
  project_count: number;
};

export type CategoryInput = z.infer<typeof categoryFormSchema>;
