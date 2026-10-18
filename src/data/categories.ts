import { cache } from "react";
import { sql } from "@/lib/db";
import type { Category } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  return await sql<Category[]>`
    SELECT id, name, slug, position, layout
    FROM categories
    ORDER BY position ASC, id ASC
  `;
}

export const getCategoryBySlug = cache(
  async (slug: string): Promise<Category | null> => {
    const categories = await sql<Category[]>`
      SELECT id, name, slug, position, layout
      FROM categories
      WHERE slug = ${slug}
      LIMIT 1
    `;

    return categories[0] ?? null;
  }
);
