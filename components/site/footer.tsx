import Link from "next/link";
import { Logo } from "./logo";
import { COMPANY, HIERARCHY } from "@/lib/constants";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-32 border-t border-border bg-canvas">
      <div className="container-tight py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {COMPANY.description}
            </p>
            <div className="mt-6 space-y-1 text-sm">
              <a href={COMPANY.phoneHref} className="block text-foreground hover:opacity-70">
                {COMPANY.phone}
              </a>
              <a href={COMPANY.emailHref} className="block text-foreground hover:opacity-70">
                {COMPANY.email}
              </a>
            </div>
            <div className="mt-8 max-w-xs">
              <p className="eyebrow mb-3">Newsletter</p>
              <NewsletterForm />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {HIERARCHY.map((division) => (
              <div key={division.slug}>
                <Link
                  href={`/${division.slug}`}
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  {division.title}
                </Link>
                <ul className="mt-4 space-y-2">
                  {division.children.flatMap((category) =>
                    category.children.map((leaf) => (
                      <li key={`${category.slug}-${leaf.slug}`}>
                        <Link
                          href={`/${leaf.slug}`}
                          className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                        >
                          {leaf.title}
                        </Link>
                      </li>
                    )),
                  )}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Company
              </p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/70">
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/courses" className="hover:text-foreground">Courses</Link></li>
                <li><Link href="/purchase-loi" className="hover:text-foreground">Purchase LOI</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {COMPANY.legalName}. All rights reserved.
          </p>
          <p>Payment by bank transfer only.</p>
        </div>
      </div>
    </footer>
  );
}
