import { z } from "zod";
import {
  cloudinaryImageUrl,
  jsonField,
  optionalEmail,
  optionalImageUrl,
  optionalText,
  requiredText,
  formString,
} from "./common";

export const settingsFormSchema = z.object({
  photographer_name: requiredText("Name", 200),
  bio: optionalText("Bio", 10000),
  profile_picture: optionalImageUrl,
  favicon: optionalImageUrl,
  // Accept "@handle" too; store the bare handle.
  instagram: formString.pipe(
    z
      .string()
      .transform((value) => value.replace(/^@/, ""))
      .pipe(
        z.union([
          z.literal(""),
          z.string().regex(/^[A-Za-z0-9._]{1,30}$/, "Enter the Instagram username only, e.g. llum.photo"),
        ])
      )
      .transform((value) => value || null)
  ),
  // Accept a pasted address too; store the bare publication name.
  substack: formString.pipe(
    z
      .string()
      .transform((value) =>
        value
          .trim()
          .toLowerCase()
          .replace(/^https?:\/\//, "")
          .replace(/\.substack\.com.*$/, "")
      )
      .pipe(
        z.union([
          z.literal(""),
          z.string().regex(/^[a-z0-9-]{1,63}$/, "Enter the name in name.substack.com, e.g. llumphoto"),
        ])
      )
      .transform((value) => value || null)
  ),
  contact_email: optionalEmail,
  location: optionalText("Location", 100),
  homepage_images: jsonField(z.array(cloudinaryImageUrl).default([])),
});
