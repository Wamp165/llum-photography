import { z } from "zod";
import {
  optionalImageUrl,
  optionalText,
  optionalYear,
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
  year_start: optionalYear("Start year"),
  year_end: optionalYear("End year"),
  location: optionalText("Location", 200),
}).refine(
  (project) =>
    project.year_start === null || project.year_end === null || project.year_end >= project.year_start,
  { path: ["year_end"], error: "The end year can't be before the start year." }
);

export const newProjectFormSchema = z.object({
  title: requiredText("Title", 200),
  category_id: positiveId,
});
