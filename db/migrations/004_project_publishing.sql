-- Projects that existed before this migration were already public: keep them visible.
-- (Only when the column is created here; a no-op where it already exists.)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'projects'
      AND column_name = 'is_published'
  ) THEN
    ALTER TABLE projects ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT false;
    UPDATE projects SET is_published = true;
  END IF;
END
$$;

ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Reordering swaps neighbours, so positions must be 1..n with no ties.
-- Renumbers keeping the current visible order (position, then id).
UPDATE categories c SET position = r.rn
FROM (SELECT id, row_number() OVER (ORDER BY position, id) AS rn FROM categories) r
WHERE c.id = r.id AND c.position <> r.rn;

UPDATE projects p SET position = r.rn
FROM (
  SELECT id, row_number() OVER (PARTITION BY category_id ORDER BY position, id) AS rn
  FROM projects
) r
WHERE p.id = r.id AND p.position <> r.rn;

UPDATE project_blocks b SET position = r.rn
FROM (
  SELECT id, row_number() OVER (PARTITION BY project_id ORDER BY position, id) AS rn
  FROM project_blocks
) r
WHERE b.id = r.id AND b.position <> r.rn;

ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_position_check;
ALTER TABLE categories ADD CONSTRAINT categories_position_check CHECK (position > 0);

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_position_check;
ALTER TABLE projects ADD CONSTRAINT projects_position_check CHECK (position > 0);

-- Restates 001-003 (idempotent). The local tables were once replaced after those
-- migrations had been recorded, losing their constraints; this guarantees them.
ALTER TABLE projects ALTER COLUMN category_id SET NOT NULL;

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_category_id_fkey;
ALTER TABLE projects
  ADD CONSTRAINT projects_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS projects_category_id_position_idx ON projects (category_id, position);
CREATE INDEX IF NOT EXISTS project_blocks_project_id_position_idx ON project_blocks (project_id, position);
