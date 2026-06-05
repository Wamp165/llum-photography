import { sql } from "@/lib/db";

export async function getSettings() {
  const [settings] = await sql`
    SELECT *
    FROM settings
    LIMIT 1
  `;

  return settings;
}