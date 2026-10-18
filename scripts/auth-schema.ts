// Prints the SQL that Better Auth needs and is missing from the DATABASE_URL database.
// It only reads the database. Save the output as a new db/migrations/NNN_*.sql file,
// review it, and apply it with `npm run db:migrate` (never Better Auth's own migrate).
//
// Usage: npm run auth:schema
// Run it after changing Better Auth options or plugins in src/lib/auth.ts.

import { getMigrations } from "better-auth/db/migration";
import { auth } from "@/lib/auth";

async function main() {
  const { compileMigrations, toBeCreated, toBeAdded } = await getMigrations(auth.options);

  if (toBeCreated.length === 0 && toBeAdded.length === 0) {
    console.error("Better Auth schema is up to date.");
  } else {
    console.log(await compileMigrations());
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
