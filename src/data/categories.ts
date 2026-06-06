import { sql } from "@/lib/db";
import type { Category } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  return await sql<Category[]>`
    SELECT *
    FROM categories
    ORDER BY position ASC
  `;
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const categories = await sql<Category[]>`
    SELECT *
    FROM categories
    WHERE slug = ${slug}
    LIMIT 1
  `;

  return categories[0] ?? null;
}