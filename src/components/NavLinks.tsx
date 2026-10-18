"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  links: { href: string; label: string }[];
};

export default function NavLinks({ links }: Props) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-wrap gap-x-8 gap-y-2 text-[17px] md:flex-1 md:flex-nowrap md:justify-between md:pl-16 lg:pl-24">
      {links.map(({ href, label }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={isActive ? "font-semibold" : "hover:text-neutral-500"}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
