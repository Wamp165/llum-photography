import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/data/categories";
import { getProjectsByCategory } from "@/data/projects";
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

  return category ? { title: category.name } : {};
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
