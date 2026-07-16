"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/cart/cart-button";
import { HIERARCHY } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDivision, setOpenDivision] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-canvas/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-tight flex h-20 items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="/about" className="text-sm text-foreground/80 transition-colors hover:text-foreground">
            About
          </Link>

          {HIERARCHY.map((division) => (
            <div
              key={division.slug}
              className="relative"
              onMouseEnter={() => setOpenDivision(division.slug)}
              onMouseLeave={() => setOpenDivision(null)}
            >
              <Link
                href={`/${division.slug}`}
                className="flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-foreground"
              >
                {division.title}
                <ChevronDown className="h-3.5 w-3.5" />
              </Link>

              {openDivision === division.slug && (
                <div className="absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 pt-4">
                  <div className="grid grid-cols-3 gap-6 rounded-lg border border-border bg-popover p-6 shadow-lg animate-fade-in">
                    {division.children.map((category) => (
                      <div key={category.slug}>
                        <Link
                          href={`/${category.slug}`}
                          className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                        >
                          {category.title}
                        </Link>
                        <ul className="space-y-1.5">
                          {category.children.map((leaf) => (
                            <li key={leaf.slug}>
                              <Link
                                href={`/${leaf.slug}`}
                                className="block text-sm text-foreground/80 transition-colors hover:text-foreground"
                              >
                                {leaf.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <Link href="/courses" className="text-sm text-foreground/80 transition-colors hover:text-foreground">
            Courses
          </Link>

          <Link href="/purchase-loi" className="text-sm text-foreground/80 transition-colors hover:text-foreground">
            Purchase LOI
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <CartButton />
          <Button asChild size="sm">
            <Link href="/contact">Contact</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 lg:hidden">
          <CartButton />
          <button
            type="button"
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-canvas lg:hidden">
          <div className="container-tight flex h-20 items-center justify-between">
            <Logo />
            <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="container-tight flex flex-col gap-8 pb-16 pt-6">
            <Link href="/about" onClick={() => setMobileOpen(false)} className="text-2xl font-medium tracking-tight">
              About
            </Link>
            {HIERARCHY.map((division) => (
              <div key={division.slug}>
                <Link
                  href={`/${division.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-medium tracking-tight"
                >
                  {division.title}
                </Link>
                <div className="mt-4 space-y-4 border-l border-border pl-4">
                  {division.children.map((category) => (
                    <div key={category.slug}>
                      <Link
                        href={`/${category.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      >
                        {category.title}
                      </Link>
                      <ul className="mt-2 space-y-2">
                        {category.children.map((leaf) => (
                          <li key={leaf.slug}>
                            <Link
                              href={`/${leaf.slug}`}
                              onClick={() => setMobileOpen(false)}
                              className="text-base text-foreground/80"
                            >
                              {leaf.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Link href="/courses" onClick={() => setMobileOpen(false)} className="text-2xl font-medium tracking-tight">
              Courses
            </Link>
            <Link href="/purchase-loi" onClick={() => setMobileOpen(false)} className="text-2xl font-medium tracking-tight">
              Purchase LOI
            </Link>
            <Link href="/cart" onClick={() => setMobileOpen(false)} className="text-2xl font-medium tracking-tight">
              Cart
            </Link>
            <Button asChild className="mt-2 w-full">
              <Link href="/contact" onClick={() => setMobileOpen(false)}>
                Contact
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
