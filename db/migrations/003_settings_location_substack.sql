ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS substack text;
