# Llum Photography

Photography portfolio with a private admin for a single photographer.
Next.js 16 · TypeScript · PostgreSQL (`postgres`, plain SQL) · Better Auth · Zod · Tailwind CSS 4 ·
shadcn/ui (admin only) · Cloudinary.

## Setup from scratch

Requirements: Node.js 22+, a PostgreSQL database.

```bash
# 1. Install
npm install

# 2. Configure: copy the example and fill it in (comments explain each variable)
cp .env.example .env.local
#    DATABASE_URL        your PostgreSQL connection string
#    BETTER_AUTH_SECRET  run: openssl rand -base64 32
#    BETTER_AUTH_URL     http://localhost:3000
#    Cloudinary keys     optional (needed only to upload from the admin)

# 3. Create / update the database schema
npm run db:migrate

# 4. Create the admin account (asks for email and password, min. 12 characters)
npm run admin:create

# 5. Start
npm run dev
```

Site: http://localhost:3000 · Admin: http://localhost:3000/admin

The first migration creates the settings row with a placeholder name: change it in
Admin → Settings.

## Deploying (Vercel + Supabase)

1. **Database**: create a Supabase project and use it only as PostgreSQL. In its settings,
   **disable the Data API** and **enable RLS on every table** (no policies needed: the app
   connects directly as the table owner).
2. **Schema and admin**, from your machine, with `DATABASE_URL` in `.env.local` pointing at
   Supabase's **transaction pooler** (port 6543) and `DATABASE_PREPARE=false`:
   ```bash
   npm run db:migrate
   npm run admin:create
   ```
   Then point `.env.local` back to your local database.
3. **Vercel**: import the repository and set every variable of `.env.example`:
   - `BETTER_AUTH_SECRET`: a **new** secret (`openssl rand -base64 32`), not the local one.
   - `BETTER_AUTH_URL`: the production URL (`https://...`).
   - `BETTER_AUTH_TRUSTED_ORIGINS`: empty.
   - `CLOUDINARY_API_SECRET`: never with a `NEXT_PUBLIC_` prefix.
4. **Check**: the site loads, `/admin` redirects to the login page, you can sign in and
   upload an image.

Secrets live only in `.env.local` (git-ignored) and in Vercel's settings; nothing secret is
committed to the repository.

## Typography

The public site loads two fonts with `next/font/google` (self-hosted by Next.js, no layout shift)
in `src/app/(site)/layout.tsx`: Open Sans for body text (`font-sans`) and Cormorant Garamond for
the navbar and category/project titles (`font-display`). Both are mapped to Tailwind tokens in
`src/app/(site)/globals.css`; to swap the display font, change the import in the layout and
`--font-display` there.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm run start` | Production build / serve it |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Apply pending SQL migrations from `db/migrations/` |
| `npm run admin:create` | Create the admin account or change its email/password |
| `npm run test:smoke` | Checks on a throwaway local database |
| `npm run auth:schema` | SQL that Better Auth is missing (for a new migration) |

Architecture, rules, database schema and step-by-step recipes: [CLAUDE.md](CLAUDE.md).
