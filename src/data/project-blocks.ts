import type { TransactionSql } from "postgres";
import { z } from "zod";
import { sql } from "@/lib/db";
import { storedProjectBlockSchema } from "@/lib/schemas/project-block";
import type {
  AdminProjectBlock,
  ProjectBlock,
  ProjectBlockData,
  ProjectBlockRow,
} from "@/types/project-block";

async function getBlockRows(projectId: number): Promise<ProjectBlockRow[]> {
  return await sql<ProjectBlockRow[]>`
    SELECT id, project_id, position, type, content
    FROM project_blocks
    WHERE project_id = ${projectId}
    ORDER BY position ASC, id ASC
  `;
}

function parseRow(row: ProjectBlockRow) {
  return storedProjectBlockSchema.safeParse({ type: row.type, content: row.content });
}

// Invalid blocks are skipped (and logged) so they never break the page. Cached with cachedSiteRead.
export const getProjectBlocks = cachedSiteRead(
  "project-blocks",
  async (projectId: number): Promise<ProjectBlock[]> => {
    const blocks: ProjectBlock[] = [];

    for (const row of await getBlockRows(projectId)) {
      const result = parseRow(row);
      if (!result.success) {
        console.error(
          `Skipping project_blocks id=${row.id}: ${z.prettifyError(result.error)}`
        );
        continue;
      }
      blocks.push({ id: row.id, project_id: row.project_id, position: row.position, ...result.data });
    }

    return blocks;
  }
);

/** Every block of a project for the admin, including invalid ones (flagged). */
export async function getAdminProjectBlocks(projectId: number): Promise<AdminProjectBlock[]> {
  return (await getBlockRows(projectId)).map((row): AdminProjectBlock => {
    const result = parseRow(row);
    return result.success
      ? {
          valid: true,
          block: { id: row.id, project_id: row.project_id, position: row.position, ...result.data },
        }
      : { valid: false, row, error: result.error.issues[0]?.message ?? "Invalid content." };
  });
}

// --- Writes (admin). `data` must come from projectBlockSchema (src/lib/schemas). ---

async function renumberBlocks(tx: TransactionSql, projectId: number): Promise<void> {
  await tx`
    UPDATE project_blocks b SET position = r.rn
    FROM (
      SELECT id, row_number() OVER (ORDER BY position, id) AS rn
      FROM project_blocks
      WHERE project_id = ${projectId}
    ) r
    WHERE b.id = r.id AND b.position <> r.rn
  `;
}

async function touchProject(tx: TransactionSql, projectId: number): Promise<void> {
  await tx`UPDATE projects SET updated_at = now() WHERE id = ${projectId}`;
}

/** Adds the block at the end of the project. Returns its id. */
export async function createProjectBlock(
  projectId: number,
  data: ProjectBlockData
): Promise<number> {
  return await sql.begin(async (tx) => {
    const [row] = await tx<{ id: number }[]>`
      INSERT INTO project_blocks (project_id, type, content, position)
      VALUES (
        ${projectId},
        ${data.type},
        ${tx.json(data.content)},
        (SELECT coalesce(max(position), 0) + 1 FROM project_blocks WHERE project_id = ${projectId})
      )
      RETURNING id
    `;
    await touchProject(tx, projectId);
    return row.id;
  });
}

/** Replaces type and content. Returns false if the block doesn't exist. */
export async function updateProjectBlock(
  blockId: number,
  data: ProjectBlockData
): Promise<boolean> {
  return await sql.begin(async (tx) => {
    const [row] = await tx<{ project_id: number }[]>`
      UPDATE project_blocks
      SET type = ${data.type}, content = ${tx.json(data.content)}
      WHERE id = ${blockId}
      RETURNING project_id
    `;
    if (!row) return false;
    await touchProject(tx, row.project_id);
    return true;
  });
}

export async function deleteProjectBlock(blockId: number): Promise<void> {
  await sql.begin(async (tx) => {
    const [row] = await tx<{ project_id: number }[]>`
      DELETE FROM project_blocks WHERE id = ${blockId} RETURNING project_id
    `;
    if (!row) return;
    await renumberBlocks(tx, row.project_id);
    await touchProject(tx, row.project_id);
  });
}

/** Swaps the block with its neighbour. */
export async function moveProjectBlock(blockId: number, direction: "up" | "down"): Promise<void> {
  await sql.begin(async (tx) => {
    const [block] = await tx<{ project_id: number }[]>`
      SELECT project_id FROM project_blocks WHERE id = ${blockId}
    `;
    if (!block) return;

    await renumberBlocks(tx, block.project_id);

    const [current] = await tx<{ position: number }[]>`
      SELECT position FROM project_blocks WHERE id = ${blockId}
    `;
    const target = current.position + (direction === "up" ? -1 : 1);
    const [neighbour] = await tx<{ id: number }[]>`
      SELECT id FROM project_blocks
      WHERE project_id = ${block.project_id} AND position = ${target}
    `;
    if (!neighbour) return;

    await tx`UPDATE project_blocks SET position = ${target} WHERE id = ${blockId}`;
    await tx`UPDATE project_blocks SET position = ${current.position} WHERE id = ${neighbour.id}`;
    await touchProject(tx, block.project_id);
  });
}
