import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

export function CTA({
  title = "Let's build something enduring.",
  description = "Tell us about your project, claim, course or trade inquiry — we respond promptly.",
  primaryHref = "/contact",
  primaryLabel = "Contact SAMORE",
}: {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
}) {
  return (
    <section className="container-tight py-24">
      <Reveal>
        <div className="rounded-lg border border-border bg-ink px-8 py-16 text-center text-white md:py-24">
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tighter md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/70">{description}</p>
          <Button
            asChild
            variant="outline"
            className="mt-8 border-white bg-transparent text-white hover:bg-white hover:text-ink"
          >
            <Link href={primaryHref}>
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
