"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  links: { href: string; label: string }[];
};

export default function NavLinks({ links }: Props) {
  const pathname = usePathname();
  // Remembers the path where the menu was opened, so navigating closes it without an effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const isOpen = openAt === pathname;

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="site-menu"
        onClick={() => setOpenAt(isOpen ? null : pathname)}
        className="absolute right-0 top-0 flex size-10 items-center justify-center md:hidden"
      >
        <span className="relative block h-3.5 w-6">
          <span
            className={`absolute left-0 h-px w-6 bg-neutral-800 transition-all ${isOpen ? "top-1.5 rotate-45" : "top-0"}`}
          />
          <span
            className={`absolute left-0 top-1.5 h-px w-6 bg-neutral-800 transition-opacity ${isOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`absolute left-0 h-px w-6 bg-neutral-800 transition-all ${isOpen ? "top-1.5 -rotate-45" : "top-3"}`}
          />
        </span>
      </button>

      <ul
        id="site-menu"
        className={`${isOpen ? "flex" : "hidden"} flex-col items-center gap-y-4 text-[17px] md:flex md:flex-1 md:flex-row md:flex-nowrap md:justify-between md:gap-y-0 md:pl-16 lg:pl-24`}
      >
        {links.map(({ href, label }) => {
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive ? "font-semibold" : "hover:text-neutral-500"
                }
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
