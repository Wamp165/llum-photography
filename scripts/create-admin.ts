// Creates the admin account, or updates its email/password if it already exists.
// Public sign-up is disabled, so this script is the only way to create the account.
//
//   npm run admin:create                      (asks for email and password)
//   ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run admin:create      (non-interactive)
//   npm run admin:create -- --delete someone@example.com         (delete an account)
//
// It uses Better Auth's own internal adapter and password hashing (auth.$context),
// the same calls its sign-up endpoint makes, so the account works with the login.

import { createInterface } from "node:readline/promises";
import { auth } from "@/lib/auth";

const MIN_PASSWORD_LENGTH = 12;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function askVisible(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

/** Reads a line from the terminal without echoing it. */
function askHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const { stdin, stdout } = process;
    stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    let value = "";
    const onData = (chunk: string) => {
      for (const char of chunk) {
        if (char === "\r" || char === "\n") {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off("data", onData);
          stdout.write("\n");
          resolve(value);
          return;
        }
        if (char === "\u0003") {
          // Ctrl+C
          stdin.setRawMode(false);
          stdout.write("\n");
          process.exit(130);
        }
        if (char === "\u007f" || char === "\b") value = value.slice(0, -1);
        else value += char;
      }
    };
    stdin.on("data", onData);
  });
}

async function deleteAccount(email: string) {
  const ctx = await auth.$context;
  const found = await ctx.internalAdapter.findUserByEmail(email);
  if (!found) throw new Error(`No account with email ${email}.`);
  await ctx.internalAdapter.deleteUser(found.user.id);
  console.log(`Account deleted: ${email}`);
}

async function createOrUpdate() {
  let email = process.env.ADMIN_EMAIL?.trim();
  let password = process.env.ADMIN_PASSWORD;

  if ((!email || !password) && !process.stdin.isTTY) {
    throw new Error("No interactive terminal. Set ADMIN_EMAIL and ADMIN_PASSWORD instead.");
  }
  if (!email) email = await askVisible("Admin email: ");
  if (!password) {
    password = await askHidden(`Password (min ${MIN_PASSWORD_LENGTH} characters): `);
    if (password !== (await askHidden("Repeat password: "))) {
      throw new Error("The passwords do not match.");
    }
  }

  email = email.toLowerCase();
  if (!EMAIL_PATTERN.test(email)) throw new Error("Invalid email address.");
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`The password must have at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  const ctx = await auth.$context;
  const hash = await ctx.password.hash(password);

  // There is a single admin: reuse the existing account if there is one.
  const sameEmail = await ctx.internalAdapter.findUserByEmail(email);
  const users = await ctx.internalAdapter.listUsers(2);
  if (users.length > 1 && !sameEmail) {
    throw new Error(
      "There is more than one account. Delete the extra one first with --delete <email>."
    );
  }
  const existing = sameEmail?.user ?? users[0];

  if (!existing) {
    const user = await ctx.internalAdapter.createUser(
      { email, name: "Admin", emailVerified: true },
      { method: "email-password" }
    );
    await ctx.internalAdapter.linkAccount({
      userId: user.id,
      providerId: "credential",
      accountId: user.id,
      password: hash,
    });
    console.log(`Admin created: ${email}`);
    return;
  }

  if (existing.email !== email) {
    await ctx.internalAdapter.updateUser(existing.id, { email, emailVerified: true });
  }

  const accounts = await ctx.internalAdapter.findAccounts(existing.id);
  if (accounts.some((account) => account.providerId === "credential")) {
    await ctx.internalAdapter.updatePassword(existing.id, hash);
  } else {
    await ctx.internalAdapter.linkAccount({
      userId: existing.id,
      providerId: "credential",
      accountId: existing.id,
      password: hash,
    });
  }

  // New credentials: close every open session.
  await ctx.internalAdapter.deleteUserSessions(existing.id);
  console.log(`Admin updated: ${email} (all sessions were closed)`);
}

async function main() {
  const deleteIndex = process.argv.indexOf("--delete");
  if (deleteIndex !== -1) {
    const email = process.argv[deleteIndex + 1];
    if (!email) throw new Error("Usage: npm run admin:create -- --delete <email>");
    await deleteAccount(email.toLowerCase());
  } else {
    await createOrUpdate();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
