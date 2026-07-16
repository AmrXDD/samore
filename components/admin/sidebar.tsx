"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV, isNavActive } from "./nav-items";
import { cn } from "@/lib/utils";

/** Desktop sidebar (lg and up). Mobile uses AdminMobileNav in the topbar. */
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-canvas lg:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="flex h-20 items-center px-6">
          <Link href="/admin" className="text-base font-semibold tracking-[0.28em]">
            SAMORE
          </Link>
          <span className="ml-2 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Admin
          </span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto border-t border-border p-4">
          {ADMIN_NAV.map((item) => {
            const active = isNavActive(pathname, item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-ink text-white"
                    : "text-foreground/70 hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            View website →
          </Link>
        </div>
      </div>
    </aside>
  );
}
