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
          className="font-logo text-body font-normal uppercase tracking-[0.2em] whitespace-nowrap md:text-title"
        >
          {photographerName}
        </Link>

        <NavLinks links={links} />
      </nav>
    </header>
  );
}
