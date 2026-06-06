import { sql } from "@/lib/db";
import type {ProjectBlock} from "@/types/project-block";

export async function getProjectBlocks(
  projectId: number
): Promise<ProjectBlock[]> {
  return await sql<ProjectBlock[]>`
    SELECT *
    FROM project_blocks
    WHERE project_id = ${projectId}
    ORDER BY position ASC
  `;
}