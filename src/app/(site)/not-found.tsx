import Link from "next/link";

// Shown inside the site layout when a page calls notFound().
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-8 py-24 text-center">
      <h1 className="mb-4 text-sm uppercase tracking-wide">Page not found</h1>
      <Link href="/" className="text-sm underline">
        Back to the homepage
      </Link>
    </div>
  );
}
