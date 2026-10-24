"use client";

import { useEffect } from "react";
import "./(site)/globals.css";

// Replaces the root layout when it fails (e.g. getSettings() or getCategories()).
// Never shows error.message. A plain <a> is used because the router may be unavailable.
export default function GlobalError({ error, retry }: { error: Error; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center px-8">
        <title>Something went wrong</title>
        <div className="text-center">
          <h1 className="mb-4 text-sm uppercase tracking-wide">Something went wrong</h1>
          <button type="button" onClick={() => retry()} className="mr-6 text-sm underline">
            Try again
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="text-sm underline">
            Back to the homepage
          </a>
        </div>
      </body>
    </html>
  );
}
