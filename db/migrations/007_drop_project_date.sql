-- project_date was replaced by year_start / year_end (006) and is no longer read.
ALTER TABLE projects DROP COLUMN IF EXISTS project_date;
