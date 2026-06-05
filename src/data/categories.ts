import { sql } from "@/lib/db";

export async function getCategories() {
  return await sql`
    SELECT *
    FROM categories
    ORDER BY name
  `;
}