-- Full schema of the app. Idempotent: a no-op on a database that already has it.
-- Closed value lists (CHECKs) must match src/lib/constants.ts (`npm run test:smoke` verifies it).

-- --- Site content -------------------------------------------------------------

-- Exactly one row (id = 1), edited from the admin's Settings page.
CREATE TABLE IF NOT EXISTS settings (
  id                INTEGER PRIMARY KEY DEFAULT 1,
  photographer_name TEXT NOT NULL,
  bio               TEXT,
  profile_picture   TEXT,
  instagram         TEXT,
  contact_email     TEXT,
  homepage_images   JSONB,
  CONSTRAINT settings_single_row CHECK (id = 1),
  CONSTRAINT settings_homepage_images_is_array
    CHECK (homepage_images IS NULL OR jsonb_typeof(homepage_images) = 'array')
);

-- getSettings() requires the row: create it with a placeholder name.
INSERT INTO settings (id, photographer_name) VALUES (1, 'Photographer')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS categories (
  id       SERIAL PRIMARY KEY,
  name     TEXT    NOT NULL,
  slug     TEXT    NOT NULL UNIQUE,
  position INTEGER NOT NULL CONSTRAINT categories_position_check CHECK (position > 0),
  layout   TEXT    NOT NULL DEFAULT 'editorial',
  CONSTRAINT categories_layout_check
    CHECK (layout IN ('editorial', 'grid', 'masonry', 'featured'))
);

CREATE TABLE IF NOT EXISTS projects (
  id           SERIAL PRIMARY KEY,
  -- RESTRICT: a category with projects cannot be deleted.
  category_id  INTEGER NOT NULL
    CONSTRAINT projects_category_id_fkey REFERENCES categories (id) ON DELETE RESTRICT,
  title        TEXT    NOT NULL,
  slug         TEXT    NOT NULL UNIQUE,
  description  TEXT,
  introduction TEXT,
  cover_image  TEXT,
  project_date DATE,
  position     INTEGER NOT NULL CONSTRAINT projects_position_check CHECK (position > 0),
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_category_id_position_idx
  ON projects (category_id, position);

-- `content` is validated by src/lib/schemas/project-block.ts according to `type`.
CREATE TABLE IF NOT EXISTS project_blocks (
  id         SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  type       TEXT    NOT NULL,
  content    JSONB   NOT NULL,
  position   INTEGER NOT NULL CHECK (position > 0),
  CONSTRAINT project_blocks_type_check CHECK (type IN (
    'only_text_center',
    'image_gallery',
    'carousel',
    'image_left_text_right',
    'image_right_text_left',
    'image_center_text_above',
    'image_center_text_below'
  )),
  CONSTRAINT project_blocks_content_is_object CHECK (jsonb_typeof(content) = 'object')
);

CREATE INDEX IF NOT EXISTS project_blocks_project_id_position_idx
  ON project_blocks (project_id, position);

-- --- Better Auth ----------------------------------------------------------------
-- Generated with `npm run auth:schema` (Better Auth 1.7.10), IF NOT EXISTS added.
-- Owned by Better Auth: application code never queries these tables with SQL.

CREATE TABLE IF NOT EXISTS "user" (
  "id"            TEXT NOT NULL PRIMARY KEY,
  "name"          TEXT NOT NULL,
  "email"         TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL,
  "image"         TEXT,
  "createdAt"     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt"     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "session" (
  "id"        TEXT NOT NULL PRIMARY KEY,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "token"     TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId"    TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
  "id"                    TEXT NOT NULL PRIMARY KEY,
  "accountId"             TEXT NOT NULL,
  "providerId"            TEXT NOT NULL,
  "userId"                TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  "accessToken"           TEXT,
  "refreshToken"          TEXT,
  "idToken"               TEXT,
  "accessTokenExpiresAt"  TIMESTAMPTZ,
  "refreshTokenExpiresAt" TIMESTAMPTZ,
  "scope"                 TEXT,
  "password"              TEXT,
  "createdAt"             TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt"             TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id"         TEXT NOT NULL PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value"      TEXT NOT NULL,
  "expiresAt"  TIMESTAMPTZ NOT NULL,
  "createdAt"  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt"  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "rateLimit" (
  "id"          TEXT NOT NULL PRIMARY KEY,
  "key"         TEXT NOT NULL UNIQUE,
  "count"       INTEGER NOT NULL,
  "lastRequest" BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" ("userId");
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account" ("userId");
CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" ("identifier");
