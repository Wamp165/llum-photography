import type { z } from "zod";
import type { settingsFormSchema } from "@/lib/schemas/settings";

export type Settings = {
  id: number;
  photographer_name: string;
  bio: string | null;
  profile_picture: string | null;
  favicon: string | null;
  instagram: string | null;
  substack: string | null;
  contact_email: string | null;
  location: string | null;
  homepage_images: string[] | null;
};
export type SettingsInput = z.infer<typeof settingsFormSchema>;
