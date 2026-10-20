import { cache } from "react";
import type { TransactionSql } from "postgres";
import { sql } from "@/lib/db";
import { cachedSiteRead } from "@/lib/site-cache";
import { slugify } from "@/lib/slugify";
import type { AdminProjectListItem, ProjectInput } from "@/types/project";
import type { ProjectListItem } from "@/types/project-list-item";

// project_date is selected as a "YYYY-MM-DD" string so it does not depend
// on the server time zone.

// --- Public reads: only published projects ----------------------------------

// Cached with cachedSiteRead; `includeDrafts` is part of the cache key, so a draft cached
// for the admin is never served to visitors.

export const getProjectsByCategory = cachedSiteRead(
  "projects-by-category",
  async (categorySlug: string): Promise<ProjectListItem[]> => {
    return await sql<ProjectListItem[]>`
      SELECT
        p.id, p.category_id, p.title, p.slug, p.description, p.position,
        p.introduction, p.cover_image,
        to_char(p.project_date, 'YYYY-MM-DD') AS project_date,
        p.is_published,
        c.slug AS category_slug
      FROM projects p
      INNER JOIN categories c ON c.id = p.category_id
      WHERE c.slug = ${categorySlug}
        AND p.is_published = true
      ORDER BY p.position ASC, p.id ASC
    `;
  }
);

/** Drafts are only returned when `includeDrafts` is true (logged-in admin previewing). */
export const getProjectBySlug = cache(
  cachedSiteRead("project-by-slug", async (
    categorySlug: string,
    projectSlug: string,
    includeDrafts: boolean
  ): Promise<ProjectListItem | null> => {
    const [project] = await sql<ProjectListItem[]>`
      SELECT
        p.id, p.category_id, p.title, p.slug, p.description, p.position,
        p.introduction, p.cover_image,
        to_char(p.project_date, 'YYYY-MM-DD') AS project_date,
        p.is_published,
        c.slug AS category_slug
      FROM projects p
      INNER JOIN categories c ON c.id = p.category_id
      WHERE c.slug = ${categorySlug}
        AND p.slug = ${projectSlug}
        AND (p.is_published = true OR ${includeDrafts})
      LIMIT 1
    `;
    return project ?? null;
  })
);

// --- Admin reads -------------------------------------------------------------

export async function getProjectById(id: number): Promise<ProjectListItem | null> {
  const [project] = await sql<ProjectListItem[]>`
    SELECT
      p.id, p.category_id, p.title, p.slug, p.description, p.position,
      p.introduction, p.cover_image,
      to_char(p.project_date, 'YYYY-MM-DD') AS project_date,
      p.is_published,
      c.slug AS category_slug
    FROM projects p
    INNER JOIN categories c ON c.id = p.category_id
    WHERE p.id = ${id}
  `;
  return project ?? null;
}

/** Every project (drafts included), in category order and then project order. */
export async function getAdminProjects(): Promise<AdminProjectListItem[]> {
  return await sql<AdminProjectListItem[]>`
    SELECT p.id, p.category_id, p.title, p.slug, p.position, p.cover_image, p.is_published
    FROM projects p
    INNER JOIN categories c ON c.id = p.category_id
    ORDER BY c.position ASC, c.id ASC, p.position ASC, p.id ASC
  `;
}

// --- Writes (admin) ----------------------------------------------------------

async function renumberProjects(tx: TransactionSql, categoryId: number): Promise<void> {
  await tx`
    UPDATE projects p SET position = r.rn
    FROM (
      SELECT id, row_number() OVER (ORDER BY position, id) AS rn
      FROM projects
      WHERE category_id = ${categoryId}
    ) r
    WHERE p.id = r.id AND p.position <> r.rn
  `;
}

/** "nordic-light", or "nordic-light-2", "-3"... if taken. */
async function findFreeProjectSlug(tx: TransactionSql, title: string): Promise<string> {
  const base = slugify(title) || "project";
  // slugify() output never contains LIKE wildcards (% or _).
  const rows = await tx<{ slug: string }[]>`
    SELECT slug FROM projects WHERE slug = ${base} OR slug LIKE ${`${base}-%`}
  `;
  const taken = new Set(rows.map((row) => row.slug));
  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix++;
  return `${base}-${suffix}`;
}

/** Creates an unpublished project at the end of its category. Returns its id. */
export async function createProject(title: string, categoryId: number): Promise<number> {
  return await sql.begin(async (tx) => {
    const slug = await findFreeProjectSlug(tx, title);
    const [row] = await tx<{ id: number }[]>`
      INSERT INTO projects (title, slug, category_id, is_published, position)
      VALUES (
        ${title},
        ${slug},
        ${categoryId},
        false,
        (SELECT coalesce(max(position), 0) + 1 FROM projects WHERE category_id = ${categoryId})
      )
      RETURNING id
    `;
    return row.id;
  });
}

/** Throws a unique violation (23505) if the slug is taken. */
export async function updateProject(id: number, input: ProjectInput): Promise<void> {
  await sql.begin(async (tx) => {
    const [current] = await tx<{ category_id: number }[]>`
      SELECT category_id FROM projects WHERE id = ${id} FOR UPDATE
    `;
    if (!current) return;

    await tx`
      UPDATE projects SET
        title = ${input.title},
        slug = ${input.slug},
        category_id = ${input.category_id},
        description = ${input.description},
        introduction = ${input.introduction},
        cover_image = ${input.cover_image},
        project_date = ${input.project_date},
        updated_at = now()
      WHERE id = ${id}
    `;

    if (current.category_id !== input.category_id) {
      // Moved to another category: put it last there and close the gap it left.
      await tx`
        UPDATE projects SET position = (
          SELECT coalesce(max(position), 0) + 1
          FROM projects
          WHERE category_id = ${input.category_id} AND id <> ${id}
        )
        WHERE id = ${id}
      `;
      await renumberProjects(tx, current.category_id);
    }
  });
}

export async function setProjectPublished(id: number, isPublished: boolean): Promise<void> {
  await sql`
    UPDATE projects SET is_published = ${isPublished}, updated_at = now()
    WHERE id = ${id}
  `;
}

/** Deletes the project and its blocks (ON DELETE CASCADE). */
export async function deleteProject(id: number): Promise<void> {
  await sql.begin(async (tx) => {
    const [deleted] = await tx<{ category_id: number }[]>`
      DELETE FROM projects WHERE id = ${id} RETURNING category_id
    `;
    if (deleted) await renumberProjects(tx, deleted.category_id);
  });
}

/** Swaps the project with its neighbour inside its category. */
export async function moveProject(id: number, direction: "up" | "down"): Promise<void> {
  await sql.begin(async (tx) => {
    const [project] = await tx<{ category_id: number }[]>`
      SELECT category_id FROM projects WHERE id = ${id}
    `;
    if (!project) return;

    await renumberProjects(tx, project.category_id);

    const [current] = await tx<{ position: number }[]>`
      SELECT position FROM projects WHERE id = ${id}
    `;
    const target = current.position + (direction === "up" ? -1 : 1);
    const [neighbour] = await tx<{ id: number }[]>`
      SELECT id FROM projects
      WHERE category_id = ${project.category_id} AND position = ${target}
    `;
    if (!neighbour) return;

    await tx`UPDATE projects SET position = ${target} WHERE id = ${id}`;
    await tx`UPDATE projects SET position = ${current.position} WHERE id = ${neighbour.id}`;
  });
}
