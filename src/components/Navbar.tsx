import Link from "next/link";
import type { Category } from "@/types/category";
import NavLinks from "./NavLinks";

type NavbarProps = {
  photographerName: string;
  categories: Category[];
};

export default function Navbar({
  photographerName,
  categories,
}: NavbarProps) {
  const links = [
    ...categories.map((category) => ({
      href: `/${category.slug}`,
      label: category.name,
    })),
    { href: "/about", label: "About" },
  ];

  return (
    <header className="site-container pb-10 pt-10 md:pb-6 md:pt-14">
      <nav className="relative flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
        <Link
          href="/"
          className="max-w-[min(17rem,calc(100%-6rem))] md:max-w-[17rem] text-balance border-b border-neutral-800 pb-3 text-center font-logo text-2xl font-normal uppercase leading-snug tracking-[0.3em]"
        >
          {photographerName}
        </Link>

        <NavLinks links={links} />
      </nav>
    </header>
  );
}
