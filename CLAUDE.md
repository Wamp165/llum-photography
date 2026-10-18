# Llum Photography

Private portfolio site + CMS for **one** photographer. One admin, no sign-up, no users.

It is **not** a page builder or a generic CMS. The set of block types and category layouts is
small and closed on purpose. Add new ones only when explicitly asked, following the recipes below.

## Stack

- Next.js 16 (App Router, Server Components), React 19, TypeScript (strict)
- PostgreSQL via the `postgres` npm package (plain SQL)
- Tailwind CSS 4
- Images hosted on Cloudinary, rendered with `next/image`
- Future deploy: Vercel + Supabase (used only as PostgreSQL: no Supabase SDK, no Supabase auth)

Next.js 16 differs from older versions you may know. When unsure about an API, read the docs
shipped in `node_modules/next/dist/docs/` (e.g. `next/image` uses `preload`, not `priority`).

## Non-negotiable rules

- **No ORM or query builder** (no Prisma, Drizzle, Kysely...). Only SQL with `postgres`.
- **No new dependencies** unless the user explicitly asks.
- **All SQL lives in `src/data/*`.** Never in pages or components.
- **Types live in `src/types/*`.** Components only declare their own `Props`.
- **Photos are never cropped.** No `object-cover`, no fixed `aspect-*` boxes that crop, no hover zoom.
  Use `h-auto w-full` / `h-auto w-auto max-h-[..]`, or `fill` + `object-contain`.
  The page adapts to the photograph, not the other way round.
- **Never pass an empty `src` to `next/image`.** If an image is missing, don't render it.
- Editorial, minimalist look. No flashy UI.
- Only one `<main>` (in `src/app/layout.tsx`). Pages use `<div>`, `<section>` or `<article>`.
- Comments in English, and only when they explain something non-obvious.

## Architecture

```
UI (src/app, src/components)  ->  src/data/*  ->  src/lib/db.ts  ->  PostgreSQL
```

| Path | Contents |
| --- | --- |
| `src/app/` | Routes. Server Components that call `src/data/*` and render components. |
| `src/components/` | Presentational components. No SQL, no data fetching. |
| `src/components/project-blocks/` | One component per block type + `BlockRenderer.tsx`. |
| `src/components/category-layouts/` | One component per category layout + `index.ts` map. |
| `src/data/` | The only place with SQL. One file per table/area. |
| `src/lib/db.ts` | The single `sql` connection pool (`server-only`). |
| `src/lib/project-blocks.ts` | Validation of block `content` (pure TypeScript). |
| `src/lib/images.ts` | Allowed image URL check (must match `next.config.ts`). |
| `src/types/` | Shared types. |
| `db/migrations/` | Numbered SQL migrations. |
| `scripts/migrate.mjs` | Migration runner. |

Every page is rendered per request (`await connection()` in `src/app/layout.tsx`), so database
changes show up immediately. Don't remove it.

Routes: `/` (home carousel), `/about`, `/[categorySlug]` (project list), `/[categorySlug]/[projectSlug]`.

## Database schema

Source of truth: `db/migrations/` (applied in order). Current state:

- **`settings`** — exactly one row with `id = 1` (CHECK `settings_single_row`). Photographer name,
  bio, profile picture, Instagram handle, contact email, `homepage_images` (JSONB array of URLs).
  `getSettings()` throws if the row is missing.
- **`categories`** — top-level sections shown in the navbar. `slug` is unique, `position` orders them.
  `layout` chooses how the project list is rendered: `editorial | grid | masonry | featured`
  (CHECK `categories_layout_check`).
- **`projects`** — belongs to one category (`category_id NOT NULL`, `ON DELETE RESTRICT`: a category
  with projects cannot be deleted). `slug` is unique across all projects. `position` orders projects
  inside a category. Optional `description` (list), `introduction` (project page), `cover_image`,
  `project_date` (DATE, read as a `"YYYY-MM-DD"` string).
- **`project_blocks`** — ordered content blocks of a project (`ON DELETE CASCADE` with the project).
  `type` is one of the block types (CHECK `project_blocks_type_check`), `content` is a JSONB object
  whose shape depends on `type`, `position > 0`.
- **`schema_migrations`** — managed by the migration runner. Don't touch.

Block types and their `content`:

| type | content |
| --- | --- |
| `only_text_center` | `{ text: string }` |
| `image_gallery` | `{ images: string[] }` — side by side, rows of 3 (intended 1–3 images) |
| `carousel` | `{ images: string[] }` — any number; 1 image shows without arrows |
| `image_left_text_right`, `image_right_text_left`, `image_center_text_above`, `image_center_text_below` | `{ image: string; text: string }` |

All image URLs must start with `https://res.cloudinary.com/`. Invalid blocks are skipped at read
time with a `console.error`, so one bad row never breaks a page.

## Migrations

1. Create `db/migrations/NNN_short_description.sql` with the next number (e.g. `004_add_x.sql`).
2. Write plain SQL. It runs inside one transaction; if anything fails, nothing is applied.
   Prefer idempotent statements (`IF NOT EXISTS`, `DROP CONSTRAINT IF EXISTS` before `ADD`).
3. Before adding a constraint, check existing data does not violate it. If data would be lost,
   stop and ask.
4. Run `npm run db:migrate`.
5. Update the types in `src/types/*` and the schema section of this file.

Never edit a migration that has already been applied: create a new one. The runner tracks
migrations by file name only.

## Recipe: add a project block type

Example: `quote` with `{ text: string; author: string }`.

1. **Type** — in `src/types/project-block.ts`, add the content type and a member to
   `ProjectBlockData`: `| { type: "quote"; content: QuoteContent }`.
2. **Validation** — in `src/lib/project-blocks.ts`, add a `validateQuoteContent` function and a
   `quote` entry in `validators` (TypeScript errors until you do).
3. **Component** — create `src/components/project-blocks/Quote.tsx`. It decides its own width
   (e.g. `mx-auto max-w-2xl`) and vertical spacing (`my-16` / `my-24`).
4. **Renderer** — add `case "quote":` to `BlockRenderer.tsx` (the `never` check errors until you do).
   No `as` casts: `block.content` is already typed by the `case`.
5. **Migration** — new migration that drops and re-adds `project_blocks_type_check` with the new
   value (copy the list from `002_block_type_check.sql`). Run `npm run db:migrate`.
6. Update the block table in this file.

## Recipe: add a category layout

Example: `list`.

1. Add `"list"` to `CategoryLayout` in `src/types/category-layout.ts`.
2. Create `src/components/category-layouts/List.tsx` receiving `CategoryLayoutProps`.
   Follow the no-cropping rules; skip the image when `cover_image` is null.
3. Add `list: List` to `categoryLayouts` in `src/components/category-layouts/index.ts`
   (TypeScript errors until you do).
4. Migration that drops and re-adds `categories_layout_check` including `'list'`.
   Run `npm run db:migrate`.
5. Update the schema section of this file.

## Environment

Copy `.env.example` to `.env.local`. Variables: `DATABASE_URL`, `DATABASE_SSL`
(defaults to `disable` for localhost, `require` otherwise), `DATABASE_PREPARE`
(`false` for Supabase's transaction pooler).

## Commands

```bash
npm run dev          # dev server on http://localhost:3000
npm run build        # production build
npm run start        # serve the production build
npm run lint         # ESLint
npx tsc --noEmit     # type check
npm run db:migrate   # apply pending migrations
```

## Before considering a change done

1. `npx tsc --noEmit`, `npm run lint` and `npm run build` pass with no errors.
2. Start the server and check with curl that `/`, `/about`, every category and at least one project
   return 200, and that a non-existent category/project returns 404.
3. For schema changes: test the migration on an empty database first
   (`CREATE DATABASE llum_migrate_test`, run with `DATABASE_URL` pointing to it, then drop it),
   and verify new constraints inside `BEGIN; ... ROLLBACK;`.
4. Visually: no cropped photos, layout works at mobile width.
