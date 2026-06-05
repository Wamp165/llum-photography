import Link from "next/link";
import type { Category } from "@/types/category";

type NavbarProps = {
  photographerName: string;
  categories: Category[];
};

export default function Navbar({
  photographerName,
  categories,
}: NavbarProps) {
  return (
    <header className="py-10">
      <nav className="mx-auto flex max-w-[1250px] items-start justify-between">
        <Link href="/">
          {photographerName}
        </Link>

        <div className="flex gap-24">
          {categories.map(category => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
            >
              {category.name}
            </Link>
          ))}

          <Link href="/contact">
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}