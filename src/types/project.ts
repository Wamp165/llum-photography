export type Project = {
  id: number;
  category_id: number | null;
  title: string;
  slug: string;
  description: string | null;
  layout: string;
  position: number;
  introduction: string | null;
  cover_image: string | null;
  project_date: Date | null;
};