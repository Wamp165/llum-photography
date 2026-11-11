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
    <header data-site-header className="w-full px-5 pt-[26px] pb-[18px] md:px-7 md:py-[22px]">
      <nav className="relative flex flex-col items-center md:flex-row md:items-start md:justify-between md:gap-8">
        <Link
          href="/"
          className="max-w-[22rem] md:max-w-[17rem] text-balance border-b border-transparent pb-3 text-center font-logo text-[26px] md:text-[24px] font-normal uppercase leading-snug tracking-[0.3em]"
        >
          {photographerName}
        </Link>

        <NavLinks links={links} />
      </nav>
    </header>
  );
}
