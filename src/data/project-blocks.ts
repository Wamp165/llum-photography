import { sql } from "@/lib/db";
import { validateProjectBlock } from "@/lib/project-blocks";
import type {
  ProjectBlock,
  ProjectBlockRow,
} from "@/types/project-block";

// Invalid blocks are skipped (and logged) so they never break the page.
export async function getProjectBlocks(
  projectId: number
): Promise<ProjectBlock[]> {
  const rows = await sql<ProjectBlockRow[]>`
    SELECT id, project_id, position, type, content
    FROM project_blocks
    WHERE project_id = ${projectId}
    ORDER BY position ASC, id ASC
  `;

  const blocks: ProjectBlock[] = [];

  for (const row of rows) {
    const result = validateProjectBlock(row.type, row.content);

    if (!result.ok) {
      console.error(
        `Skipping project_blocks id=${row.id}: ${result.error}`
      );
      continue;
    }

    blocks.push({
      id: row.id,
      project_id: row.project_id,
      position: row.position,
      ...result.block,
    });
  }

  return blocks;
}
