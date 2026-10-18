ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS layout TEXT NOT NULL DEFAULT 'editorial';

ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_layout_check;
ALTER TABLE categories
  ADD CONSTRAINT categories_layout_check
  CHECK (layout IN ('editorial', 'grid', 'masonry', 'featured'));

-- Abort instead of silently dropping non-default projects.layout values.
DO $$
DECLARE
  non_default_count INTEGER;
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'projects'
      AND column_name = 'layout'
  ) THEN
    EXECUTE
      'SELECT count(*) FROM projects WHERE layout IS DISTINCT FROM ''editorial'''
      INTO non_default_count;

    IF non_default_count > 0 THEN
      RAISE EXCEPTION
        'projects.layout has % rows other than editorial; review them before dropping the column.',
        non_default_count;
    END IF;

    ALTER TABLE projects DROP COLUMN layout;
  END IF;
END
$$;
