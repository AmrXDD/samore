import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "./reveal";

export type Crumb = { title: string; href: string };

export function PageHero({
  eyebrow,
  title,
  lede,
  crumbs = [],
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="container-tight pt-16 md:pt-24">
      {crumbs.length > 0 ? (
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                <Link href={c.href} className="hover:text-foreground">
                  {c.title}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <Reveal>
        {eyebrow ? <p className="eyebrow mb-5">{eyebrow}</p> : null}
        <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tighter md:text-6xl">
          {title}
        </h1>
        {lede ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {lede}
          </p>
        ) : null}
      </Reveal>
    </section>
  );
}
