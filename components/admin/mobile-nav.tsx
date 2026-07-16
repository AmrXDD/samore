"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ADMIN_NAV, isNavActive } from "./nav-items";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

/** Slide-over admin navigation for phone + tablet (below lg). */
export function AdminMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open admin menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-secondary lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Scrim */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/40"
          />
          {/* Panel */}
          <div className="absolute inset-y-0 left-0 flex w-[min(17rem,85vw)] flex-col border-r border-border bg-canvas shadow-xl">
            <div className="flex h-20 shrink-0 items-center justify-between px-5">
              <Logo href="/admin" size={26} />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
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
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors",
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

            <div className="shrink-0 border-t border-border p-4">
              <Link href="/" className="px-3 text-xs text-muted-foreground hover:text-foreground">
                View website →
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
