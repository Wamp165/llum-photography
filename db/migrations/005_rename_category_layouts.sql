-- Layouts renamed: "editorial" -> "showcase", "featured" -> "carousel" (new design).
UPDATE categories SET layout = 'showcase' WHERE layout = 'editorial';
UPDATE categories SET layout = 'carousel' WHERE layout = 'featured';
ALTER TABLE categories ALTER COLUMN layout SET DEFAULT 'showcase';
