# Llum Photography

Photography portfolio and private CMS for a single photographer.
Next.js 16 · TypeScript · PostgreSQL (`postgres`, plain SQL) · Tailwind CSS 4 · Cloudinary.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL
npm run db:migrate           # create / update the database schema
npm run dev                  # http://localhost:3000
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Apply pending SQL migrations from `db/migrations/` |

Architecture, database schema, conventions and step-by-step recipes are in [CLAUDE.md](CLAUDE.md).
