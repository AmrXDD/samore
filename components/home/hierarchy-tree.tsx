"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { HIERARCHY } from "@/lib/constants";
import { cn } from "@/lib/utils";

type BoxVariant = "root" | "division" | "category" | "leaf";

function TreeBox({
  title,
  href,
  variant,
  delay = 0,
}: {
  title: string;
  href?: string;
  variant: BoxVariant;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  const styles: Record<BoxVariant, string> = {
    root: "bg-ink text-white border-ink text-base font-semibold tracking-[0.18em] px-8 py-4",
    division:
      "bg-ink text-white border-ink font-medium hover:bg-transparent hover:text-ink px-6 py-3",
    category:
      "bg-card text-ink border-2 border-ink font-medium hover:bg-ink hover:text-white px-5 py-3",
    leaf: "bg-card text-ink border border-border hover:border-ink hover:bg-ink hover:text-white px-4 py-2.5 text-sm",
  };

  const content = (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn(
        "flex items-center justify-center rounded-lg text-center transition-colors duration-200",
        styles[variant],
      )}
    >
      {title}
    </motion.div>
  );

  if (!href) return content;
  return (
    <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
      {content}
    </Link>
  );
}

/** Thin vertical connector. */
function VLine({ className }: { className?: string }) {
  return <div className={cn("mx-auto w-px bg-border", className)} aria-hidden />;
}

export function HierarchyTree() {
  const [engineering, trading] = HIERARCHY;

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="mx-auto flex min-w-[900px] max-w-5xl flex-col items-center">
        {/* Root */}
        <TreeBox title="SAMORE" variant="root" />
        <VLine className="h-8" />

        {/* Division bus */}
        <div className="relative flex w-full items-start justify-center gap-24">
          {/* horizontal bus connecting the two divisions */}
          <div className="absolute left-1/4 right-1/4 top-0 h-px bg-border" aria-hidden />

          {/* Engineering & Construction */}
          <div className="relative flex flex-1 flex-col items-center pt-8">
            <div className="absolute left-1/2 top-0 h-8 w-px bg-border" aria-hidden />
            <TreeBox
              title={engineering.title}
              href={`/${engineering.slug}`}
              variant="division"
            />
            <VLine className="h-8" />

            {/* Categories row */}
            <div className="relative flex w-full justify-between gap-6">
              <div className="absolute left-[16.66%] right-[16.66%] top-0 h-px bg-border" aria-hidden />
              {engineering.children.map((category, i) => (
                <div key={category.slug} className="relative flex flex-1 flex-col items-center pt-8">
                  <div className="absolute left-1/2 top-0 h-8 w-px bg-border" aria-hidden />
                  <TreeBox
                    title={category.title}
                    href={`/${category.slug}`}
                    variant="category"
                    delay={i * 0.05}
                  />
                  <VLine className="h-6" />
                  <div className="flex w-full flex-col items-stretch gap-3">
                    {category.children.map((leaf, j) => (
                      <TreeBox
                        key={`${category.slug}-${leaf.slug}-${j}`}
                        title={leaf.title}
                        href={`/${leaf.slug}`}
                        variant="leaf"
                        delay={i * 0.05 + j * 0.04}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Steel & Oil Trading */}
          <div className="relative flex w-[280px] flex-col items-center pt-8">
            <div className="absolute left-1/2 top-0 h-8 w-px bg-border" aria-hidden />
            <TreeBox title={trading.title} href={`/${trading.slug}`} variant="division" />
            <VLine className="h-8" />
            <div className="relative flex w-full justify-center gap-6">
              <div className="absolute left-1/4 right-1/4 top-0 h-px bg-border" aria-hidden />
              {trading.children.map((category, i) => (
                <div key={category.slug} className="relative flex flex-1 flex-col items-center pt-8">
                  <div className="absolute left-1/2 top-0 h-8 w-px bg-border" aria-hidden />
                  <TreeBox
                    title={category.title}
                    href={`/${category.slug}`}
                    variant="leaf"
                    delay={i * 0.05}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
