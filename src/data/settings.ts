import { sql } from "@/lib/db";
import type { Settings } from "@/types/settings";

export async function getSettings(): Promise<Settings> {
  const [settings] = await sql<Settings[]>`
    SELECT *
    FROM settings
    LIMIT 1
  `;

  return settings;
}