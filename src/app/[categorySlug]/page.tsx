import { notFound } from "next/navigation";
import { getProjectsByCategory } from "@/data/projects";
import Editorial from "@/components/project-layouts/Editorial";
import { getCategoryBySlug } from "@/data/categories";

type Props = {
  params: Promise<{
    categorySlug: string;
  }>;
};

export default async function CategoryPage({
  params,
}: Props) {
  const { categorySlug } = await params;
  const category =
    await getCategoryBySlug(categorySlug);

    if (!category) {
        notFound();
    }
  const projects =
    await getProjectsByCategory(categorySlug);

  const layout = projects[0]?.layout;
  switch (layout) {
    case "editorial":
      return (
        <main className="mx-auto max-w-6xl px-8">
          <Editorial projects={projects} />
        </main>
      );

    default:
      return (
        <main className="mx-auto max-w-6xl px-8">
          <Editorial projects={projects} />
        </main>
      );
  }
}