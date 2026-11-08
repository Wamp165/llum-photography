import type { Project } from "@/types/project";

/** "2020 - 2024", or a single year. Null when there is no year at all. */
export function formatYears(start: number | null, end: number | null): string | null {
  if (start !== null && end !== null && end !== start) return `${start} - ${end}`;
  const year = start ?? end;
  return year === null ? null : String(year);
}

/** "Istanbul, Turkey · 2024 - 2025": the location and years that are set, or null. */
export function projectMeta(project: Pick<Project, "location" | "year_start" | "year_end">): string | null {
  const parts = [project.location, formatYears(project.year_start, project.year_end)].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}
