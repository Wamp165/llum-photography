import { createAuthClient } from "better-auth/react";

// Browser-side Better Auth client. Only the login form uses it: signing in
// through the HTTP API (not a Server Action) keeps Better Auth's rate limiting
// in front of the password check.
export const authClient = createAuthClient();
