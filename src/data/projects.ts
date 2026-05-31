import { sql } from "@/lib/db";

export async function getProjects() {
  return await sql`
    SELECT *
    FROM projects
    ORDER BY created_at DESC
  `;
}