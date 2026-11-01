"use client";

import Link from "next/link";
import { useEffect } from "react";

// Shown inside the site layout when a page fails. Never shows error.message.
export default function SiteError({ error, retry }: { error: Error; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-8 py-24 text-center">
      <h1 className="mb-4 text-meta uppercase tracking-wide">Something went wrong</h1>
      <button type="button" onClick={() => retry()} className="mr-6 text-meta underline">
        Try again
      </button>
      <Link href="/" className="text-meta underline">
        Back to the homepage
      </Link>
    </div>
  );
}
