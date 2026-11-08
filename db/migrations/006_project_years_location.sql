-- Projects: optional start/end year and location. The old exact date is kept (no longer read
-- by the app): its year seeds `year_start` so nothing is lost.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS year_start SMALLINT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS year_end SMALLINT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS location TEXT;

UPDATE projects
SET year_start = EXTRACT(YEAR FROM project_date)::SMALLINT
WHERE year_start IS NULL AND project_date IS NOT NULL;
