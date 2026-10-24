-- The closed value lists (category layouts, block types) now live only in
-- src/lib/constants.ts and are enforced by Zod on write.
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_layout_check;
ALTER TABLE project_blocks DROP CONSTRAINT IF EXISTS project_blocks_type_check;
