import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type CurrentAdmin = {
  id: string;
  email: string;
  name: string;
};

/**
 * The logged-in admin, or null. Cached per request.
 * Sign-up is disabled, so every account is the admin.
 */
export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
});

/**
 * Call at the top of EVERY admin page and EVERY admin Server Action / route handler.
 * The proxy only checks that a cookie exists; this validates the session.
 */
export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
}
