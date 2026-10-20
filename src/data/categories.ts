import { cache } from "react";
import type { TransactionSql } from "postgres";
import { sql } from "@/lib/db";
import { cachedSiteRead } from "@/lib/site-cache";
import type {
  Category,
  CategoryInput,
  CategoryWithProjectCount,
} from "@/types/category";

// --- Public reads (cached, see cachedSiteRead) --------------------------------

export const getCategories = cache(
  cachedSiteRead("categories", async (): Promise<Category[]> => {
    return await sql<Category[]>`
      SELECT id, name, slug, position, layout
      FROM categories
      ORDER BY position ASC, id ASC
    `;
  })
);

export const getCategoryBySlug = cache(
  cachedSiteRead("category-by-slug", async (slug: string): Promise<Category | null> => {
    const categories = await sql<Category[]>`
      SELECT id, name, slug, position, layout
      FROM categories
      WHERE slug = ${slug}
      LIMIT 1
    `;

    return categories[0] ?? null;
  })
);

/** For the admin: every category with its number of projects (drafts included). */
export async function getCategoriesWithProjectCount(): Promise<CategoryWithProjectCount[]> {
  return await sql<CategoryWithProjectCount[]>`
    SELECT
      c.id, c.name, c.slug, c.position, c.layout,
      count(p.id)::int AS project_count
    FROM categories c
    LEFT JOIN projects p ON p.category_id = c.id
    GROUP BY c.id
    ORDER BY c.position ASC, c.id ASC
  `;
}

// --- Writes (admin) ---------------------------------------------------------

async function renumberCategories(tx: TransactionSql): Promise<void> {
  await tx`
    UPDATE categories c SET position = r.rn
    FROM (SELECT id, row_number() OVER (ORDER BY position, id) AS rn FROM categories) r
    WHERE c.id = r.id AND c.position <> r.rn
  `;
}

/** Adds the category at the end. Throws a unique violation (23505) if the slug is taken. */
export async function createCategory(input: CategoryInput): Promise<number> {
  const [row] = await sql<{ id: number }[]>`
    INSERT INTO categories (name, slug, layout, position)
    VALUES (
      ${input.name},
      ${input.slug},
      ${input.layout},
      (SELECT coalesce(max(position), 0) + 1 FROM categories)
    )
    RETURNING id
  `;
  return row.id;
}

/** Throws a unique violation (23505) if the slug is taken. */
export async function updateCategory(id: number, input: CategoryInput): Promise<void> {
  await sql`
    UPDATE categories SET
      name = ${input.name},
      slug = ${input.slug},
      layout = ${input.layout}
    WHERE id = ${id}
  `;
}

/** Returns false (and deletes nothing) when the category still has projects. */
export async function deleteCategory(id: number): Promise<boolean> {
  return await sql.begin(async (tx) => {
    const [{ count }] = await tx<{ count: number }[]>`
      SELECT count(*)::int AS count FROM projects WHERE category_id = ${id}
    `;
    if (count > 0) return false;

    await tx`DELETE FROM categories WHERE id = ${id}`;
    await renumberCategories(tx);
    return true;
  });
}

/** Swaps the category with its neighbour. Positions are renumbered 1..n first. */
export async function moveCategory(id: number, direction: "up" | "down"): Promise<void> {
  await sql.begin(async (tx) => {
    await renumberCategories(tx);

    const [current] = await tx<{ position: number }[]>`
      SELECT position FROM categories WHERE id = ${id}
    `;
    if (!current) return;

    const target = current.position + (direction === "up" ? -1 : 1);
    const [neighbour] = await tx<{ id: number }[]>`
      SELECT id FROM categories WHERE position = ${target}
    `;
    if (!neighbour) return;

    await tx`UPDATE categories SET position = ${target} WHERE id = ${id}`;
    await tx`UPDATE categories SET position = ${current.position} WHERE id = ${neighbour.id}`;
  });
}
