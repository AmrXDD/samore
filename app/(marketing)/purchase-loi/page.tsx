import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { LoiForm } from "@/components/forms/loi-form";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Purchase Letter of Intent",
  description:
    "Generate a Purchase Letter of Intent for SAMORE steel or oil trading — product, quantity, monthly delivery and destination. Download an official LOI instantly.",
  alternates: { canonical: "/purchase-loi" },
};

const STEPS = [
  "Complete the buyer and product details.",
  "Generate an official SAMORE Purchase LOI (PDF).",
  "Our trading desk issues the FCO / proforma invoice and SPA.",
  "Settle by bank instrument (MT700 / SBLC) or transfer; delivery follows.",
];

export default function PurchaseLoiPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Purchase Letter of Intent",
    url: `${SITE_URL}/purchase-loi`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow="Steel & Oil Trading"
        title="Purchase Letter of Intent"
        lede="Serious buyers can issue an official Letter of Intent to begin a steel or oil purchase. Complete the form to generate and download your LOI in seconds."
        crumbs={[{ title: "Steel & Oil Trading", href: "/steel-oil-trading" }]}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow mb-4">How it works</p>
            <ol className="space-y-5">
              {STEPS.map((step, i) => (
                <Reveal key={step} delay={i * 0.05}>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-foreground/90">{step}</span>
                  </li>
                </Reveal>
              ))}
            </ol>

            <div className="mt-10 rounded-lg border border-border bg-card p-6">
              <p className="eyebrow mb-4">Included commitment</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  "Confirms buyer intent and financial ability.",
                  "Requests the proforma invoice and purchase contract.",
                  "States product, quantity, monthly delivery and destination.",
                  "Aligned with SAMORE's MT700 / SBLC purchase procedure.",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <LoiForm />
        </div>
      </Section>
    </>
  );
}
