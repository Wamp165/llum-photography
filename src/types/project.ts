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
};
