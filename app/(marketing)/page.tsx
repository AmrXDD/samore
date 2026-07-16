import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeading } from "@/components/site/section";
import { CTA } from "@/components/site/cta";
import { HierarchyTree } from "@/components/home/hierarchy-tree";
import { COMPANY, HIERARCHY, SITE_URL } from "@/lib/constants";
import { getHero } from "@/lib/queries";
import { SERVICES } from "@/lib/services";

const STATS = [
  { value: "30", label: "Expert cases" },
  { value: "60", label: "Claim performances" },
  { value: "22", label: "Professional courses" },
  { value: "3", label: "Trades under one house" },
];

const COURSE_HIGHLIGHTS = [
  { value: "22", label: "Courses in the catalogue" },
  { value: "5 days", label: "Per course" },
  { value: "20 hrs", label: "Instruction time" },
  { value: "USD", label: "Transparent pricing" },
];

export default async function HomePage() {
  const hero = await getHero();

  const headline = hero?.headline ?? "Engineering excellence. Steel & oil, sourced direct.";
  const eyebrow = hero?.eyebrow ?? COMPANY.tagline;
  const sub =
    hero?.subheadline ??
    "At SAMORE we stand at the crossroads of innovation and tradition — a partner in success across construction technical support, conflict resolution, value engineering, engineering education, and steel & oil trading.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.legalName,
    alternateName: COMPANY.name,
    url: SITE_URL,
    email: COMPANY.email,
    telephone: COMPANY.phone,
    description: COMPANY.description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY.phone,
      email: COMPANY.email,
      contactType: "sales",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="container-tight pt-24 md:pt-36">
        <Reveal>
          <p className="eyebrow mb-6">{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[1.02] tracking-tightest md:text-7xl lg:text-[5.5rem]">
            {headline}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {sub}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link href={hero?.cta_href ?? "/engineering-construction"}>
                {hero?.cta_label ?? "Explore services"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </Reveal>

        {/* Stats */}
        <Reveal delay={0.2}>
          <dl className="mt-20 grid grid-cols-2 gap-8 border-t border-border pt-10 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="text-4xl font-semibold tracking-tighter md:text-5xl">{s.value}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* Hierarchy tree */}
      <Section>
        <SectionHeading
          eyebrow="Company structure"
          title="One house. Three trades. Every service."
          description="An exact map of the SAMORE organisation. Select any division or service to explore it."
        />
        <div className="mt-14">
          <HierarchyTree />
        </div>
      </Section>

      {/* Divisions */}
      <Section className="pt-0">
        <div className="grid gap-6 md:grid-cols-2">
          {HIERARCHY.map((division, i) => {
            const svc = SERVICES[division.slug];
            return (
              <Reveal key={division.slug} delay={i * 0.05}>
                <Link
                  href={`/${division.slug}`}
                  className="group flex h-full flex-col justify-between rounded-lg border border-border bg-card p-8 transition-colors hover:border-ink md:p-12"
                >
                  <div>
                    <p className="eyebrow mb-4">Division</p>
                    <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                      {division.title}
                    </h3>
                    <p className="mt-4 max-w-md text-muted-foreground">{svc?.lede}</p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                    Explore division
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Courses CTA */}
      <Section className="pt-0">
        <Reveal>
          <div className="rounded-lg border border-border bg-card p-8 md:p-14">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <p className="eyebrow mb-4">Engineering Education</p>
                <h2 className="text-balance text-3xl font-semibold tracking-tighter md:text-4xl">
                  22 professional courses. Enroll online, pay by bank transfer.
                </h2>
                <p className="mt-5 max-w-xl text-muted-foreground">
                  Primavera P6 planning, construction claims, FIDIC & BOT contracts, value
                  engineering, arbitration and more — each five days and twenty hours, taught by
                  instructors with deep, realistic construction experience.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href="/courses">
                      Browse & enroll
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/engineering-courses">View full catalogue</Link>
                  </Button>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
                {COURSE_HIGHLIGHTS.map((h) => (
                  <div key={h.label} className="bg-card p-6">
                    <dt className="text-2xl font-semibold tracking-tighter">{h.value}</dt>
                    <dd className="mt-1 text-xs text-muted-foreground">{h.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </Section>

      <CTA />
    </>
  );
}
