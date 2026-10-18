import type { Metadata } from "next";
import Link from "next/link";
import "./(site)/globals.css";

// Shown for URLs that match no route. It renders without any layout.
export const metadata: Metadata = {
  title: "Not found",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center px-8">
        <div className="text-center">
          <h1 className="mb-4 text-sm uppercase tracking-wide">Page not found</h1>
          <Link href="/" className="text-sm underline">
            Back to the homepage
          </Link>
        </div>
      </body>
    </html>
  );
}
