import { cache } from "react";
import { sql } from "@/lib/db";
import type { Settings, SettingsInput } from "@/types/settings";

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
      "The settings row (id = 1) is missing: run `npm run db:migrate`."
    );
  }

  return settings;
});

export async function updateSettings(input: SettingsInput): Promise<void> {
  await sql`
    UPDATE settings SET
      photographer_name = ${input.photographer_name},
      bio = ${input.bio},
      profile_picture = ${input.profile_picture},
      instagram = ${input.instagram},
      contact_email = ${input.contact_email},
      homepage_images = ${sql.json(input.homepage_images)}
    WHERE id = 1
  `;
}
