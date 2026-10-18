// Runs once when the server starts: fail fast with a clear message if an
// environment variable is missing or invalid (see src/lib/env.ts).
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("@/lib/env");
  }
}
