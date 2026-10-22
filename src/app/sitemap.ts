import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { env } from "@/lib/env";
import { getCategories } from "@/data/categories";
import { getPublishedProjectsForSitemap } from "@/data/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Read the database per request instead of freezing the list at build time.
  await connection();

  const base = env.BETTER_AUTH_URL.replace(/\/+$/, "");
  const [categories, projects] = await Promise.all([
    getCategories(),
    getPublishedProjectsForSitemap(),
  ]);

  return [
    { url: `${base}/` },
    { url: `${base}/about` },
    ...categories.map((category) => ({ url: `${base}/${category.slug}` })),
    ...projects.map((project) => ({
      url: `${base}/${project.category_slug}/${project.slug}`,
      lastModified: project.updated_at,
    })),
  ];
}
