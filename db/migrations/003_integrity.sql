ALTER TABLE projects ALTER COLUMN category_id SET NOT NULL;

-- A category with projects cannot be deleted.
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_category_id_fkey;
ALTER TABLE projects
  ADD CONSTRAINT projects_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS projects_category_id_position_idx
  ON projects (category_id, position);
CREATE INDEX IF NOT EXISTS project_blocks_project_id_position_idx
  ON project_blocks (project_id, position);
-- Superseded by projects_category_id_position_idx.
DROP INDEX IF EXISTS idx_projects_position;

ALTER TABLE project_blocks DROP CONSTRAINT IF EXISTS project_blocks_content_is_object;
ALTER TABLE project_blocks
  ADD CONSTRAINT project_blocks_content_is_object
  CHECK (jsonb_typeof(content) = 'object');

ALTER TABLE settings DROP CONSTRAINT IF EXISTS settings_homepage_images_is_array;
ALTER TABLE settings
  ADD CONSTRAINT settings_homepage_images_is_array
  CHECK (homepage_images IS NULL OR jsonb_typeof(homepage_images) = 'array');

ALTER TABLE settings DROP CONSTRAINT IF EXISTS settings_single_row;
ALTER TABLE settings
  ADD CONSTRAINT settings_single_row CHECK (id = 1);
