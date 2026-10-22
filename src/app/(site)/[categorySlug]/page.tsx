import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/data/categories";
import { getProjectsByCategory } from "@/data/projects";
import { getSettings } from "@/data/settings";
import { socialMetadata } from "@/lib/social-metadata";
import { categoryLayouts } from "@/components/category-layouts";

type Props = {
  params: Promise<{
    categorySlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) return {};

  const [settings, projects] = await Promise.all([
    getSettings(),
    getProjectsByCategory(categorySlug), // published only: drafts never reach metadata
  ]);

  return {
    title: category.name,
    ...socialMetadata({
      siteName: settings.photographer_name,
      title: category.name,
      image: projects.find((project) => project.cover_image)?.cover_image,
    }),
  };
}

export default async function CategoryPage({
  params,
}: Props) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const projects = await getProjectsByCategory(categorySlug);
  const Layout = categoryLayouts[category.layout];

  return (
    <div className="site-container">
      <h1 className="sr-only">{category.name}</h1>
      <Layout projects={projects} />
    </div>
  );
}
