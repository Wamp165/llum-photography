import { cache } from "react";
import { sql } from "@/lib/db";
import type { Project } from "@/types/project";
import type { ProjectListItem } from "@/types/project-list-item";

// project_date is selected as a "YYYY-MM-DD" string so it does not depend
// on the server time zone.

export async function getProjectsByCategory(
  categorySlug: string
): Promise<ProjectListItem[]> {
  return await sql<ProjectListItem[]>`
    SELECT
      p.id,
      p.category_id,
      p.title,
      p.slug,
      p.description,
      p.position,
      p.introduction,
      p.cover_image,
      to_char(p.project_date, 'YYYY-MM-DD') AS project_date,
      c.slug AS category_slug
    FROM projects p
    INNER JOIN categories c
      ON c.id = p.category_id
    WHERE c.slug = ${categorySlug}
    ORDER BY p.position ASC, p.id ASC
  `;
}

export const getProjectBySlug = cache(
  async (
    categorySlug: string,
    projectSlug: string
  ): Promise<Project | null> => {
    const projects = await sql<Project[]>`
      SELECT
        p.id,
        p.category_id,
        p.title,
        p.slug,
        p.description,
        p.position,
        p.introduction,
        p.cover_image,
        to_char(p.project_date, 'YYYY-MM-DD') AS project_date
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
);
