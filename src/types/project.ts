import type { z } from "zod";
import type { projectFormSchema } from "@/lib/schemas/project";

/** Row of `projects` as selected by src/data/projects.ts. */
export type Project = {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  description: string | null;
  position: number;
  introduction: string | null;
  cover_image: string | null;
  /** "YYYY-MM-DD" */
  project_date: string | null;
  is_published: boolean;
};

export type AdminProjectListItem = Pick<
  Project,
  "id" | "category_id" | "title" | "slug" | "position" | "cover_image" | "is_published"
>;

export type ProjectInput = z.infer<typeof projectFormSchema>;
