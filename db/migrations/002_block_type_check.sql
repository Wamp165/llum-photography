-- Must match ProjectBlockData in src/types/project-block.ts.

DO $$
DECLARE
  unknown_types TEXT;
BEGIN
  SELECT string_agg(DISTINCT type, ', ')
  INTO unknown_types
  FROM project_blocks
  WHERE type NOT IN (
    'only_text_center',
    'image_gallery',
    'carousel',
    'image_left_text_right',
    'image_right_text_left',
    'image_center_text_above',
    'image_center_text_below'
  );

  IF unknown_types IS NOT NULL THEN
    RAISE EXCEPTION 'Unknown block types in project_blocks: %', unknown_types;
  END IF;
END
$$;

ALTER TABLE project_blocks DROP CONSTRAINT IF EXISTS project_blocks_type_check;
ALTER TABLE project_blocks
  ADD CONSTRAINT project_blocks_type_check
  CHECK (type IN (
    'only_text_center',
    'image_gallery',
    'carousel',
    'image_left_text_right',
    'image_right_text_left',
    'image_center_text_above',
    'image_center_text_below'
  ));
