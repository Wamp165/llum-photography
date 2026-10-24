# Llum Photography

A photography portfolio built with Next.js, with a private admin panel for
managing content.

Pages are built from layouts and content blocks arranged from the admin. New
blocks, layouts and features are added over time through the workflow below.

## Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Database | PostgreSQL on Supabase, plain SQL with `postgres` |
| Auth | Better Auth |
| Images | Cloudinary |
| Validation | Zod |
| Styling | Tailwind CSS 4, shadcn/ui (admin) |
| Hosting | Vercel |
| CI | GitHub Actions |

## Workflow

1. A change request is sent as a message on Telegram.
2. A bot turns the message into a GitHub issue.
3. Claude Code picks up the issue and opens a pull request.
4. CI runs type checks, lint, a production build and smoke tests against a
   temporary database.
5. Vercel deploys a preview of the branch.
6. I review the code and the preview, request changes if needed, and merge.

Every change goes through a pull request and a manual review before it reaches
production. Project conventions are documented in [CLAUDE.md](CLAUDE.md).

## Getting started

Requirements: Node.js 22+ and a PostgreSQL database.

```bash
npm install
cp .env.example .env.local   # each variable is documented in the file
npm run db:migrate
npm run admin:create
npm run dev
```

The site runs at `http://localhost:3000` and the admin at `/admin`.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Apply pending migrations from `db/migrations/` |
| `npm run admin:create` | Create or update the admin account |
| `npm run test:smoke` | Run smoke tests on a local database |
