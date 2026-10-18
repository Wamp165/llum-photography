"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logoutAction } from "../actions";

const LINKS = [
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-1 md:flex-col md:items-stretch">
      {LINKS.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Button
            key={link.href}
            asChild
            variant={active ? "secondary" : "ghost"}
            className={cn("md:justify-start", !active && "text-muted-foreground")}
          >
            <Link href={link.href} aria-current={active ? "page" : undefined}>
              {link.label}
            </Link>
          </Button>
        );
      })}

      <span className="hidden md:my-2 md:block md:border-t" />

      <Button asChild variant="ghost" className="text-muted-foreground md:justify-start">
        <a href="/" target="_blank" rel="noreferrer">
          View site <ExternalLink />
        </a>
      </Button>

      <form action={logoutAction}>
        <Button type="submit" variant="ghost" className="w-full text-muted-foreground md:justify-start">
          <LogOut /> Log out
        </Button>
      </form>
    </nav>
  );
}
