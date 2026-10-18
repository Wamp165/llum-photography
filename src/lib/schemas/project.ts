import { z } from "zod";
import {
  optionalDate,
  optionalImageUrl,
  optionalText,
  positiveId,
  requiredText,
  slug,
} from "./common";

export const projectFormSchema = z.object({
  title: requiredText("Title", 200),
  slug,
  category_id: positiveId,
  description: optionalText("Description", 2000),
  introduction: optionalText("Introduction", 20000),
  cover_image: optionalImageUrl,
  project_date: optionalDate,
});

export const newProjectFormSchema = z.object({
  title: requiredText("Title", 200),
  category_id: positiveId,
});
