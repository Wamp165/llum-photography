import { sql } from "@/lib/db";
import type { Project } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
  return await sql<Project[]>`
    SELECT *
    FROM projects
    ORDER BY position
  `;
}