"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-guard";

export async function logoutAction(): Promise<void> {
  await requireAdmin();
  // nextCookies() (src/lib/auth.ts) clears the session cookie from this Server Action.
  await auth.api.signOut({ headers: await headers() });
  redirect("/admin/login");
}
