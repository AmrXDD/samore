import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { CTA } from "@/components/site/cta";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "SAMORE — engineering services and steel & oil trading. Our mission, values and the deliverables that make us a partner in success.",
  alternates: { canonical: "/about" },
};

const DELIVERABLES = [
  "Dynamic, effective and precise outcomes that exceed client expectations.",
  "Informed decision-making powered by realistic data analysis.",
  "Comprehensive project management across every variable condition.",
  "Collaborative team approach with strict adherence to documentation.",
  "Consistent quality across small and large projects alike.",
  "Centralised oversight from head office for uniform quality.",
  "Long-term partnerships over one-off engagements.",
  "Transparent, logical and competitive fee structure.",
];

const CONTRACTS = [
  "Governmental contracts",
  "Private sector contracts",
  "Cost-plus contracts",
  "BOT contracts",
  "Construction investment contracts",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A partner in success — where innovation meets tradition."
        lede={`We are ${COMPANY.name}, delivering excellence in engineering services alongside best-price steel and oil trading. Guided by integrity, resilience and vision.`}
      />

      <Section className="pb-0">
        <div className="grid gap-16 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="eyebrow mb-4">Our mission</p>
              <p className="text-lg leading-relaxed text-foreground/90">
                To provide high-quality engineering services, resolve construction conflicts,
                and offer the best prices in steel and oil trading.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div>
              <p className="eyebrow mb-4">Our message</p>
              <p className="text-lg leading-relaxed text-foreground/90">
                To be the ideal engineering company operating across multiple sectors of the
                engineering and construction industry — applying our creativity to find the
                optimum project solutions and meet our clients' needs responsibly.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Deliverables" title="What defines SAMORE engineering" />
        <div className="mt-12 grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {DELIVERABLES.map((d, i) => (
            <Reveal key={d} delay={i * 0.03}>
              <div className="flex items-start gap-3 border-t border-border pt-5">
                <Check className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-foreground/90">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-12 rounded-lg border border-border bg-card p-8 md:grid-cols-2 md:p-12">
          <div>
            <p className="eyebrow mb-4">Our resources</p>
            <h3 className="text-2xl font-semibold tracking-tight">
              The best-qualified team for every service
            </h3>
            <p className="mt-4 text-muted-foreground">
              A homogeneous, well-communicated team — highly qualified and familiar with both
              construction and pre-construction environments. Our wide experience lets us control
              project cost during construction to maximise client benefit.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-4">Contracts we manage</p>
            <ul className="space-y-3">
              {CONTRACTS.map((c) => (
                <li key={c} className="flex items-center gap-3 border-b border-border pb-3 text-foreground/90">
                  <Check className="h-4 w-4 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="flex flex-col items-start justify-between gap-6 border-t border-border pt-10 md:flex-row md:items-center">
          <div>
            <p className="eyebrow mb-2">Flexible deals</p>
            <p className="max-w-xl text-lg text-foreground/90">
              We customise our services to your needs — engaging on a monthly, weekly, daily or
              hourly basis.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 text-sm font-medium underline underline-offset-4 hover:opacity-70"
          >
            Start a conversation
          </Link>
        </div>
      </Section>

      <CTA />
    </>
  );
}
