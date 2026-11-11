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
        className="flex size-10 items-center justify-center md:hidden"
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
        data-site-links
        className={`${isOpen ? "flex" : "hidden"} mt-[14px] flex-col items-center gap-y-4 font-logo text-[15px] leading-[1.7] font-normal md:mt-2 md:mr-4 md:flex md:flex-none md:flex-row md:flex-nowrap md:justify-end md:gap-9 md:leading-[1.3]`}
      >
        {links.map(({ href, label }, index) => {
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li
              key={href}
              style={{ "--i": index } as React.CSSProperties}
            >
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className="relative block pb-1 font-normal"
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
