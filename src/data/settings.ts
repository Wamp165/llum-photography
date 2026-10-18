import { cache } from "react";
import { sql } from "@/lib/db";
import type { Settings } from "@/types/settings";

export const getSettings = cache(async (): Promise<Settings> => {
  const [settings] = await sql<Settings[]>`
    SELECT
      id,
      photographer_name,
      bio,
      profile_picture,
      instagram,
      contact_email,
      homepage_images
    FROM settings
    WHERE id = 1
  `;

  if (!settings) {
    throw new Error(
      "The settings table is empty: insert the row with id = 1 (see CLAUDE.md)."
    );
  }

  return settings;
});
