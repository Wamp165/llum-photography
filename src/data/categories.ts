import { sql } from "@/lib/db";
import type { Category } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  return await sql<Category[]>`
    SELECT *
    FROM categories
    ORDER BY position ASC
  `;
}