import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// First barrier only: redirects /admin/* to the login page when there is no
// session cookie at all. It does NOT validate the session. The real check is
// requireAdmin() in every admin page and Server Action (see CLAUDE.md).
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login" || getSessionCookie(request)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
