# Llum Photography

Portfolio site + private admin for **one** photographer. One admin account, no public sign-up.

It is **not** a page builder or a generic CMS. Block types and category layouts are a small,
closed set on purpose. Add new ones only when asked, following the recipes below.

## Stack and decisions

- **Next.js 16** (App Router, Server Components, Server Actions), React 19, TypeScript strict,
  Tailwind CSS 4. **No separate backend**: everything runs in this one Next.js app (Vercel).
- **PostgreSQL with the `postgres` package. No ORM, no query builder.** All SQL lives in `src/data/*`.
- **Zod** validates every input: forms, block JSONB content, environment variables.
- **Better Auth** for authentication (email + password, sessions in the database).
  Exception to "SQL only in src/data": Better Auth manages its own tables (`user`, `session`,
  `account`, `verification`, `rateLimit`) through its `pg` pool. Our code never queries them;
  it uses `auth.api` / `auth.$context`.
- **shadcn/ui only in the admin** (`src/components/ui`, `src/app/admin/admin.css`).
  The public site keeps its own editorial design (`src/app/(site)/globals.css`).
- Images on **Cloudinary**, rendered with `next/image` through a custom loader
  (`src/lib/cloudinary-loader.ts`): Cloudinary resizes (`c_limit`, never crops), not our server.
  Admin uploads: next-cloudinary's signed widget.
- Next.js 16 differs from older versions. When unsure, read `node_modules/next/dist/docs/`
  (e.g. `proxy.ts` replaces `middleware.ts`; `next/image` uses `preload`, not `priority`).

## Non-negotiable rules

1. **SQL only in `src/data/*`** (scripts and Better Auth's internals are the only exceptions).
   `src/lib/db.ts` is imported only from `src/data/*`.
2. **`await requireAdmin()` first thing in EVERY admin page and EVERY admin Server Action**
   (and route handler: check `getCurrentAdmin()` and return 401). Server Actions are public HTTP
   endpoints; `src/proxy.ts` only checks that a cookie exists and is **not** security.
3. **Zod on every write**: `schema.safeParse(...)` in the Server Action before calling `src/data`.
   Bound action arguments (ids, directions) come from the browser too: validate them.
4. **Photos are never cropped**, anywhere (admin thumbnails included): no `object-cover`, no
   fixed `aspect-*` box that crops, no hover zoom. Use `h-auto w-full`, `h-auto w-auto max-h-[..]`
   or `fill` + `object-contain`. Never pass an empty `src` to `next/image`.
5. **shadcn/ui only in the admin.** Never import `@/components/ui/*` from public pages/components.
6. **Every schema change is a numbered `.sql` migration** in `db/migrations/` (Better Auth's tables
   included). Never use Better Auth's own `migrate` command.
7. Closed values (`CATEGORY_LAYOUTS`, `BLOCK_TYPES`) live in `src/lib/constants.ts`; the SQL CHECK
   constraints must list exactly the same values (`npm run test:smoke` verifies it).
8. Types for database rows are hand-written in `src/types/*`; block types are inferred from Zod.
   Components only declare their own `Props`.
9. One `<main>` per page. Comments in English and only when they explain something non-obvious.
10. No new dependencies unless the user asks.

## Folder map

```
src/
  app/
    (site)/            Public site. Its own root layout (<html>, globals.css, Navbar, <main>).
    admin/             Admin. Its own root layout (<html>, admin.css with shadcn, Toaster).
      login/           Login page (signs in through Better Auth's HTTP API).
      (panel)/         Everything behind login: layout with nav + requireAdmin().
        settings/ categories/ projects/ projects/[id]/
                       page.tsx (Server Component) + actions.ts (Server Actions) + client forms.
      actions.ts       Logout.
    api/auth/[...all]/ Better Auth HTTP handler.
    api/sign-cloudinary-params/  Signs admin uploads (admin only).
    global-not-found.tsx         404 for unmatched URLs (two root layouts → experimental.globalNotFound).
    robots.ts                    robots.txt (disallows /admin and /api).
  components/
    ui/                shadcn/ui (generated; admin only).
    admin/             Admin building blocks: ActionForm, Field, ActionButton, ImageInput, ...
    admin/block-forms/ One form per block type + the typed `blockForms` map.
    admin/blocks/      Block editor list (BlockListItem, AddBlock, BlockEditor, BlockSummary).
    project-blocks/    Public block components + BlockRenderer.
    category-layouts/  Public list layouts + the `categoryLayouts` map.
  data/                The only place with SQL. Reads and writes per entity.
  lib/
    env.ts             Environment variables (Zod). Imported at startup by src/instrumentation.ts.
    db.ts              The `postgres` connection (server-only, globalThis singleton).
    auth.ts            Better Auth config.     auth-client.ts  Browser client (login form).
    auth-guard.ts      getCurrentAdmin() / requireAdmin().
    constants.ts       CATEGORY_LAYOUTS, BLOCK_TYPES, ... (source of truth).
    schemas/           Zod schemas: common, project-block, settings, category, project.
    slugify.ts  revalidate.ts  format-date.ts  utils.ts (shadcn `cn`)
  types/               Row types and shared types.
  proxy.ts             Optimistic redirect of /admin/* without a session cookie.
db/migrations/         NNN_description.sql, applied by scripts/migrate.mjs.
scripts/               migrate.mjs, create-admin.ts, auth-schema.ts, smoke-test.ts.
```

## Authentication

- Better Auth, email + password, `disableSignUp: true`. The only account is created with
  `npm run admin:create` (uses `auth.$context.internalAdapter`, the same calls as Better Auth's
  sign-up). Every account is the admin.
- Sessions are stored in the `session` table; the cookie is managed by Better Auth
  (`better-auth.session_token`, httpOnly). 30 days, refreshed daily while in use.
- **Login goes through the HTTP API** (`authClient.signIn.email` in `LoginForm.tsx`), not a Server
  Action: Better Auth's rate limiting only runs on HTTP requests. Limit: 5 sign-in attempts per IP
  per minute (stored in the `rateLimit` table, so it works across serverless instances).
- `nextCookies()` lets `auth.api` calls from Server Actions (logout, session refresh) set cookies.
- `src/lib/auth-guard.ts`: `getCurrentAdmin()` (cached per request) and `requireAdmin()`.
- **Pending: 2FA** with Better Auth's `twoFactor` plugin: add it to `plugins` in `src/lib/auth.ts`
  (before `nextCookies()`), run `npm run auth:schema`, save the SQL as a new migration, apply it,
  and add the verification step to the login page.

## Server Action pattern

```ts
"use server";
export async function saveThing(thingId: number, _state: ActionState, formData: FormData): Promise<ActionResult> {
  await requireAdmin();                                            // 1. auth
  const id = positiveId.safeParse(thingId);                        // 2. validate (Zod)
  const input = thingFormSchema.safeParse(Object.fromEntries(formData));
  if (!id.success) return { ok: false, error: "Invalid thing." };
  if (!input.success) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsOf(input.error) };
  try { await updateThing(id.data, input.data); }                  // 3. src/data
  catch (error) { if (isUniqueViolation(error)) return { ok: false, error: "...", fieldErrors: { slug: "..." } }; throw error; }
  revalidateSite();                                                // 4. revalidate
  return { ok: true };                                             // 5. result
}
```

Client side: `<ActionForm action={saveThing.bind(null, id)}>` with `<Field name="...">` inside
(errors per field, disabled button while saving, "Saved" toast). Single buttons (move, delete,
publish) use `<ActionButton>`; destructive ones pass `confirm={...}` (shadcn AlertDialog).
Reordering = swap `position` with the neighbour in a transaction after renumbering 1..n.

## Database schema

Source of truth: `db/migrations/` (`001_initial_schema.sql` is the full schema; later changes
go in new numbered files). Current state:

- **`settings`** — exactly one row, `id = 1` (CHECK), created by the first migration with a
  placeholder name. Photographer name, bio, profile picture, Instagram handle, contact email,
  `homepage_images` (JSONB array of URLs). `getSettings()` throws if the row is missing.
- **`categories`** — sections in the menu. `slug` unique (some slugs are reserved, see constants),
  `position` 1..n, `layout` in `CATEGORY_LAYOUTS` (CHECK `categories_layout_check`).
- **`projects`** — `category_id` NOT NULL, `ON DELETE RESTRICT` (a category with projects can't
  be deleted). `slug` unique across all projects. `position` 1..n inside its category.
  `is_published` (public pages only show `true`; drafts are visible to the logged-in admin with a
  "Draft — not public" strip). `description` (list), `introduction` (project page), `cover_image`,
  `project_date` (DATE, read as `"YYYY-MM-DD"`), `created_at`, `updated_at`.
- **`project_blocks`** — ordered blocks of a project, `ON DELETE CASCADE`. `type` in `BLOCK_TYPES`
  (CHECK `project_blocks_type_check`), `content` JSONB object validated by
  `src/lib/schemas/project-block.ts`, `position` 1..n. Invalid rows are skipped on the public site
  (with `console.error`) and flagged in the admin.
- **Better Auth**: `user`, `session`, `account` (password hash, `providerId = 'credential'`),
  `verification`, `rateLimit`. Never query them with SQL.
- **`schema_migrations`** — managed by `scripts/migrate.mjs`.

| Block type | content |
| --- | --- |
| `only_text_center` | `{ text }` |
| `image_gallery` | `{ images }` — 1 to 3 when saving (side by side; older rows with more show in rows of 3) |
| `carousel` | `{ images }` — 1 or more (one image shows without arrows) |
| `image_left_text_right`, `image_right_text_left`, `image_center_text_above`, `image_center_text_below` | `{ image, text }` |

Image URLs must be `https://res.cloudinary.com/...` (`cloudinaryImageUrl` in `schemas/common.ts`,
same host as `images.remotePatterns` in `next.config.ts`).

## Recipes

### Create and apply a migration
1. Add `db/migrations/NNN_short_description.sql` with the next number. Plain SQL, runs in one
   transaction. Prefer idempotent statements (`IF NOT EXISTS`, `DROP CONSTRAINT IF EXISTS` + `ADD`).
2. Before adding a constraint, check the existing data. If data would be lost, stop and ask.
3. `npm run db:migrate`. Never edit an applied migration (tracked by file name): add a new one.
4. Update `src/types/*` and the schema section above.
5. Test on an empty database too: `npm run test:smoke` applies every migration to a throwaway DB.

### Add an editable field to an entity (example: `projects.location`)
1. Migration: `ALTER TABLE projects ADD COLUMN IF NOT EXISTS location TEXT;` → `npm run db:migrate`.
2. Type: add `location: string | null` to `Project` in `src/types/project.ts`.
3. Data: add the column to the SELECTs and the UPDATE in `src/data/projects.ts`.
4. Validation: add `location: optionalText("Location", 200)` to `projectFormSchema`
   (`src/lib/schemas/project.ts`); `ProjectInput` updates itself.
5. Form: add `<Field label="Location" name="location">{(id) => <Input id={id} name="location"
   defaultValue={project.location ?? ""} />}</Field>` to `ProjectForm.tsx`.
6. Show it on the public page if needed. Run the checks below.

### Add a block type (example: `quote` with `{ text, author }`)
1. `src/lib/constants.ts`: add `"quote"` to `BLOCK_TYPES`.
2. Migration: drop and re-add `project_blocks_type_check` with the new list → `npm run db:migrate`.
3. Zod: add `z.object({ type: z.literal("quote"), content: z.object({ text, author: ... }) })` to the
   union in `src/lib/schemas/project-block.ts` (a compile-time check fails until you do).
4. Public component: `src/components/project-blocks/Quote.tsx` (decides its own width/spacing),
   then a `case "quote":` in `BlockRenderer.tsx` (the `never` check fails until you do).
5. Admin form: `src/components/admin/block-forms/QuoteBlockFields.tsx` (inputs + hidden
   `content` JSON), registered in `blockForms` in `block-forms/index.tsx` (compile error until you
   do), and a `case` in `components/admin/blocks/BlockSummary.tsx`.
6. Update the block table above. `npx tsc --noEmit` and `npm run test:smoke`.

### Add a category layout (example: `list`)
1. `src/lib/constants.ts`: add `"list"` to `CATEGORY_LAYOUTS`.
2. Migration: drop and re-add `categories_layout_check` with the new list → `npm run db:migrate`.
3. `src/components/category-layouts/List.tsx` receiving `CategoryLayoutProps` (no cropping; skip
   the image when `cover_image` is null), registered in `category-layouts/index.ts`.
4. Add its label to `LAYOUT_LABELS` in `src/app/admin/(panel)/categories/CategoryForm.tsx`.
5. `npx tsc --noEmit` and `npm run test:smoke`.

## Caching

- Public reads in `src/data/*` are wrapped with `cachedSiteRead()` (`src/lib/site-cache.ts`, Next's
  data cache): `getSettings`, `getCategories`, `getCategoryBySlug`, `getProjectsByCategory`,
  `getProjectBySlug`, `getProjectBlocks`. All share the tag `SITE_CACHE_TAG` and revalidate every
  hour as a fallback for changes made outside the admin. Pages are still rendered per request
  (`await connection()` in the site layout); only the data is cached.
- **Admin reads are never cached** (`getAdminProjects`, `getProjectById`, `getAdminProjectBlocks`,
  `getCategoriesWithProjectCount`), nor `getCurrentAdmin()`: they are per user.
- **Every admin write must call `revalidateSite()`**, which expires the shared tag immediately.
- A new public read in `src/data/*` must use `cachedSiteRead()` with a unique key prefix. Arguments
  are part of the key (`includeDrafts` keeps drafts away from visitors) and results must be plain JSON data.
- Outside Next (smoke test, seed scripts) `cachedSiteRead()` reads the database directly.

## Environment variables

See `.env.example` (validated by `src/lib/env.ts`, the server fails to start with a clear message):
`DATABASE_URL`, `DATABASE_SSL`, `DATABASE_PREPARE`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`,
`BETTER_AUTH_TRUSTED_ORIGINS`, and optionally `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`,
`NEXT_PUBLIC_CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (all three, or uploads are disabled).

## Commands

```bash
npm run dev           # dev server, http://localhost:3000
npm run build         # production build
npm run start         # serve the build
npm run lint          # ESLint
npx tsc --noEmit      # type check
npm run db:migrate    # apply pending migrations
npm run admin:create  # create/update the admin account (interactive, or ADMIN_EMAIL/ADMIN_PASSWORD)
npm run auth:schema   # print the SQL Better Auth is missing (after changing its config/plugins)
npm run test:smoke    # checks on a throwaway local database (CHECKs vs constants, Zod, data layer)
```

Note: `npm install` of a package depending on `better-auth` may hit an npm bug ("edgesOut"); use
`--legacy-peer-deps` for that install (its peer deps are all optional).

## CI

`.github/workflows/ci.yml` runs on every pull request and every push to `main` (`ubuntu-latest`,
Node 22, npm cache, 15 min timeout, one run per branch: `cancel-in-progress: true`).

- A `postgres:16` service container with a healthcheck. `DATABASE_URL` points to it
  (`localhost:5432`); CI never gets production or Supabase credentials or any secret.
- Test env vars are set in the workflow (`BETTER_AUTH_SECRET` is a fixed throwaway value,
  `BETTER_AUTH_URL=http://localhost:3000`, Cloudinary empty: uploads are optional in `env.ts`).
- Steps, in order, each visible on its own: `npm ci`, `npm run db:migrate`, `npm run db:seed:ci`
  (`scripts/seed-ci.ts`: settings, a category, a published project with a block, fake data,
  `https://res.cloudinary.com/demo/...` URLs), `npx tsc --noEmit`, `npm run lint`,
  `npm run build`, `npm run test:smoke`.
- The npm scripts use `--env-file-if-exists=.env.local`, so they work without that file.
- Keep the seed valid when schemas change (it goes through `src/data/*`). Any new env var required
  by `src/lib/env.ts` must also be added to the workflow. Don't add secrets or remote databases to CI.
- To reproduce locally: empty local database, same env vars, then run the steps above in order.

## Deploying (Vercel + Supabase)

- Use Supabase only as PostgreSQL. `DATABASE_URL` = the **transaction pooler** (port 6543) with
  `DATABASE_PREPARE=false`; SSL defaults to `require`.
- Pools are small per serverless instance: `postgres` max 3 (`src/lib/db.ts`) and Better Auth's
  `pg` Pool max 2 (`src/lib/auth.ts`), both closing idle connections; constants at the top of each file.
- Run `npm run db:migrate` against Supabase (from your machine, with its `DATABASE_URL`), then
  `npm run admin:create`.
- In Supabase: **disable the Data API** and **enable RLS on every table without policies**. The
  direct connection as the table owner keeps working; nobody can reach the tables through Supabase's
  public API.
- Set every variable of `.env.example` in Vercel; `BETTER_AUTH_URL` = the production URL,
  `BETTER_AUTH_TRUSTED_ORIGINS` empty.
- `next.config.ts` adds security headers to every response and `src/app/robots.ts` keeps
  `/admin` and `/api` out of search engines (the admin also sends `noindex`).

## Before considering a change done

1. `npx tsc --noEmit`, `npm run lint` and `npm run build` pass.
2. `npm run test:smoke` passes.
3. With the server running: `/`, `/about`, every category and published project return 200; a
   draft and an unknown slug return 404; `/admin` without a session redirects to `/admin/login`.
4. Every new Server Action starts with `await requireAdmin()`; no SQL outside `src/data/*`.
5. Visually: no cropped photos, works at phone width (admin included).
