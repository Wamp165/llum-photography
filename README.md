# Llum Photography

Photography portfolio with a private admin for a single photographer.
Next.js 16 · TypeScript · PostgreSQL (`postgres`, plain SQL) · Better Auth · Zod · Tailwind CSS 4 ·
shadcn/ui (admin only) · Cloudinary.

## Setup from scratch

Requirements: Node.js 20+, a PostgreSQL database.

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
