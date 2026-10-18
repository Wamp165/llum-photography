import { z } from "zod";
import { CATEGORY_LAYOUTS, RESERVED_CATEGORY_SLUGS } from "@/lib/constants";
import { requiredText, slug } from "./common";

export const categoryFormSchema = z.object({
  name: requiredText("Name", 100),
  slug: slug.refine(
    (value) => !(RESERVED_CATEGORY_SLUGS as readonly string[]).includes(value),
    "This slug is reserved, choose another one."
  ),
  layout: z.enum(CATEGORY_LAYOUTS, { error: "Choose a layout." }),
});
