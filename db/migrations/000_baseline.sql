-- Schema as it existed before migrations were introduced (2026-10-18).
-- IF NOT EXISTS: no-op on the existing local database, full setup on an empty one.

CREATE TABLE IF NOT EXISTS categories (
  id       SERIAL PRIMARY KEY,
  name     TEXT    NOT NULL,
  slug     TEXT    NOT NULL UNIQUE,
  position INTEGER NOT NULL,
  layout   TEXT    NOT NULL DEFAULT 'editorial'
);

CREATE TABLE IF NOT EXISTS projects (
  id           SERIAL PRIMARY KEY,
  category_id  INTEGER REFERENCES categories (id),
  title        TEXT    NOT NULL,
  slug         TEXT    NOT NULL UNIQUE,
  description  TEXT,
  position     INTEGER NOT NULL DEFAULT 999,
  introduction TEXT,
  cover_image  TEXT,
  project_date DATE
);

CREATE INDEX IF NOT EXISTS idx_projects_position ON projects (position);

CREATE TABLE IF NOT EXISTS project_blocks (
  id         SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  type       TEXT    NOT NULL,
  content    JSONB   NOT NULL,
  position   INTEGER NOT NULL CHECK (position > 0)
);

CREATE TABLE IF NOT EXISTS settings (
  id                INTEGER PRIMARY KEY DEFAULT 1,
  photographer_name TEXT NOT NULL,
  bio               TEXT,
  profile_picture   TEXT,
  instagram         TEXT,
  contact_email     TEXT,
  homepage_images   JSONB
);
