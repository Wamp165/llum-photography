import { sql } from "@/lib/db";
import type { Project } from "@/types/project";
import type { ProjectListItem } from "@/types/project-list-item";

export async function getProjectsByCategory(
  categorySlug: string
): Promise<ProjectListItem[]> {
  return await sql<ProjectListItem[]>`
    SELECT
      p.*,
      c.slug AS category_slug
    FROM projects p
    INNER JOIN categories c
      ON c.id = p.category_id
    WHERE c.slug = ${categorySlug}
    ORDER BY p.position ASC
  `;
}

export async function getProjectBySlug(
  categorySlug: string,
  projectSlug: string
): Promise<Project | null> {
  const projects = await sql<Project[]>`
    SELECT p.*
    FROM projects p
    INNER JOIN categories c
      ON c.id = p.category_id
    WHERE
      c.slug = ${categorySlug}
      AND p.slug = ${projectSlug}
    LIMIT 1
  `;

  return projects[0] ?? null;
}