import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";
import { PageHero, type Crumb } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { Button } from "@/components/ui/button";
import {
  getService,
  SERVICES,
  COURSE_CATALOG,
  EDUCATION_PRICING,
  type ServiceContent,
} from "@/lib/services";
import { HIERARCHY } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function buildCrumbs(service: ServiceContent): Crumb[] {
  const crumbs: Crumb[] = [];
  let cursor: ServiceContent | null = service;
  const chain: ServiceContent[] = [];
  while (cursor) {
    chain.unshift(cursor);
    cursor = cursor.parentSlug ? getService(cursor.parentSlug) : null;
  }
  // Exclude the current page itself from clickable crumbs.
  for (const node of chain.slice(0, -1)) {
    crumbs.push({ title: node.title, href: `/${node.slug}` });
  }
  return crumbs;
}

/** Child services to surface (division/category overview pages). */
function childrenOf(slug: string): { title: string; slug: string; lede: string }[] {
  const out: { title: string; slug: string; lede: string }[] = [];
  for (const division of HIERARCHY) {
    if (division.slug === slug) {
      for (const category of division.children) {
        const svc = SERVICES[category.slug];
        if (svc) out.push({ title: svc.title, slug: svc.slug, lede: svc.lede });
      }
      return out;
    }
    for (const category of division.children) {
      if (category.slug === slug) {
        for (const leaf of category.children) {
          const svc = SERVICES[leaf.slug];
          if (svc && svc.slug !== slug) out.push({ title: svc.title, slug: svc.slug, lede: svc.lede });
        }
        return out;
      }
    }
  }
  return out;
}

export function ServiceView({ service }: { service: ServiceContent }) {
  const crumbs = buildCrumbs(service);
  const children = childrenOf(service.slug);

  return (
    <>
      <PageHero
        eyebrow={service.eyebrow}
        title={service.title}
        lede={service.lede}
        crumbs={crumbs}
      />

      {/* Overview */}
      <Section className="pb-0">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            {service.overview.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="text-lg leading-relaxed text-foreground/90">{p}</p>
              </Reveal>
            ))}
            {service.gated ? (
              <Reveal>
                <div className="rounded-lg border border-border bg-secondary/60 p-5">
                  <div className="flex items-start gap-3">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Live pricing and full commercial procedures are shared with serious,
                      verified buyers on request. Use the inquiry form below to receive the
                      current offer, or issue a Purchase Letter of Intent to begin.
                    </p>
                  </div>
                  <Button asChild size="sm" className="mt-4">
                    <Link href="/purchase-loi">
                      Generate Purchase LOI
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Reveal>
            ) : null}
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-lg border border-border bg-card p-8">
              <p className="eyebrow mb-5">Benefits</p>
              <ul className="space-y-4">
                {service.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="text-sm leading-relaxed text-foreground/90">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Capabilities */}
      <Section>
        <SectionHeading eyebrow="Capabilities" title="What we deliver" />
        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {service.capabilities.map((cap, i) => (
            <Reveal key={cap.title} delay={i * 0.04}>
              <div className="h-full bg-card p-8">
                <span className="text-xs font-medium text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{cap.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {cap.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section className="pt-0">
        <SectionHeading eyebrow="Process" title="How we work" />
        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {service.process.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.05}>
              <div className="border-t-2 border-ink pt-5">
                <span className="text-sm font-semibold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Course catalogue (Engineering Courses) */}
      {service.slug === "engineering-courses" ? (
        <Section className="pt-0">
          <SectionHeading
            eyebrow="Catalogue"
            title="Professional course catalogue"
            description="Every course runs over five days and twenty hours. Prices in USD."
          />
          <div className="mt-10 rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Code</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right">Days</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COURSE_CATALOG.map((c) => (
                  <TableRow key={c.code}>
                    <TableCell className="font-mono text-xs">{c.code}</TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-right">{c.days}</TableCell>
                    <TableCell className="text-right">{c.hours}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(c.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-8">
            <Button asChild>
              <Link href="/courses">
                Enroll in live courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Section>
      ) : null}

      {/* Education pricing (Engineering Education) */}
      {service.slug === "engineering-education" ? (
        <Section className="pt-0">
          <SectionHeading eyebrow="Pricing" title="Education services & pricing" />
          <div className="mt-10 rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Price (USD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EDUCATION_PRICING.map((e) => (
                  <TableRow key={e.service}>
                    <TableCell className="font-medium">{e.service}</TableCell>
                    <TableCell className="text-muted-foreground">{e.unit}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(e.usd)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Section>
      ) : null}

      {/* Child services */}
      {children.length > 0 ? (
        <Section className="pt-0">
          <SectionHeading eyebrow="Explore" title={`Within ${service.title}`} />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {children.map((child, i) => (
              <Reveal key={child.slug} delay={i * 0.05}>
                <Link
                  href={`/${child.slug}`}
                  className="group flex h-full flex-col justify-between rounded-lg border border-border bg-card p-6 transition-colors hover:border-ink"
                >
                  <div>
                    <h3 className="font-semibold tracking-tight">{child.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{child.lede}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium">
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Inquiry */}
      <Section id="inquiry" className="pt-0">
        <div className="rounded-lg border border-border bg-card p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="eyebrow mb-4">Inquiry</p>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Discuss {service.title}
              </h2>
              <p className="mt-4 text-muted-foreground">
                Send us the details and our team will respond with the right approach for your
                project or requirement.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/contact">Full contact details</Link>
              </Button>
            </div>
            <ContactForm defaultInquiry={inquiryFor(service)} />
          </div>
        </div>
      </Section>
    </>
  );
}

function inquiryFor(service: ServiceContent): string {
  if (service.division === "steel-oil-trading") {
    if (service.slug === "oil-trading") return "Oil Trading";
    if (service.slug === "steel-trading") return "Steel Trading";
    return "Steel Trading";
  }
  if (service.slug.includes("technical-support") || service.parentSlug === "project-technical-support")
    return "Project Technical Support";
  if (service.slug.includes("conflict") || service.parentSlug === "construction-conflict-solutions")
    return "Construction Conflict Solutions";
  if (service.slug.includes("education") || service.parentSlug === "engineering-education")
    return "Engineering Education";
  return "Engineering & Construction";
}
