import Image from "next/image";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SteelPrice, OilPrice } from "@/types";

/**
 * Specification sheets — reproduced exactly as supplied in the official
 * SAMORE steel offer document (SCO). These are hard-coded on purpose: they are
 * the manufacturer's spec sheets and must not change.
 */
const STEEL_SPECS = [
  { src: "/specs/billet-specifications.jpg", alt: "Billet specifications", label: "Billet Specifications", w: 720, h: 1010 },
  { src: "/specs/rail-r50-specification.jpg", alt: "Railway Second Quality R50 specification", label: "Railway — Second Quality — R 50", w: 599, h: 622 },
  { src: "/specs/rail-r65-specification.jpg", alt: "Railway Second Quality R65 specification", label: "Railway — Second Quality — R 65", w: 507, h: 617 },
  { src: "/specs/rail-material-and-profile.jpg", alt: "Rail material and profile specification", label: "Material and profile specification", w: 746, h: 291 },
  { src: "/specs/rail-dimensions.jpg", alt: "Rail dimensions R65 (P65)", label: "Rail dimensions — R65 (P65)", w: 630, h: 222 },
  { src: "/specs/wire-rod-and-rebar-in-coils.jpg", alt: "Wire rod and rebar in coils", label: "Wire Rod and Rebar in Coils", w: 842, h: 595 },
  { src: "/specs/technical-facts.jpg", alt: "Rebar technical facts", label: "Technical Facts", w: 842, h: 595 },
  { src: "/specs/quenching-process.jpg", alt: "The quenching process and rebar discoloration", label: "The Quenching Process — Facts and Effects", w: 842, h: 595 },
];

/** Text reproduced verbatim from the steel SCO document. */
const PRICE_INCLUDES = ["VAT Tax and", "Bank Administrative Charges"];

const BUSINESS_OFFERS = [
  "IN case if Buyers wants to issue SBLC with 10% of the contract value the prices are +40 USD",
  "In Case if the buyer pays advanced payment MT103, the prices are -20 USD of the given prices",
  "We accept a direct MT103 transferee VS Delivery of big quantities covering the transferred fund",
];

const PURCHASE_PROCEDURE = [
  "After receiving the FCO, Buyer to return (Via official mail) the following documents: sign the FCO and stamp (all pages) to express your approval to all forms and procedures; receipt of proforma invoice fees (Purchase seriousness fees — it is refunded after MT700).",
  "After receiving the proforma invoice transfer receipt, SAMORE co. shall mail the Main Seller to issue the proforma invoice and the SPA.",
  "(Main Seller) issue (performance invoice + The SPA Contract) to the Buyer directly (Via official mail).",
  "(Main Seller) and buyer exchange signing and stamp contract (Via official mail).",
  "Buyer Issues a revolving, irrevocable confirmed, insight MT700 with bank guarantee for full quantity.",
  "Seller issues a performance bond of 20 % of total contract value for good execution.",
  "After acceptance of MT700 by Seller bank, Delivery starts within 7 days.",
];

/** Text reproduced verbatim from the oil SCO document. */
const ICPO_ATTACHMENTS = [
  "Buyer Company Registration Certificate",
  "Owner Passport",
  "BCL from the buyer bank stated that the buyer is able to manage the financial resources for his ICPO",
];

function EmptyPrices({ what }: { what: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
      {what} are issued on request. Please contact our trading desk for the current offer.
    </div>
  );
}

/* ────────────────────────────── STEEL ────────────────────────────── */

export function SteelTradeSection({ prices }: { prices: SteelPrice[] }) {
  // Group rows exactly as the document lays them out.
  const groups = prices.reduce<Record<string, SteelPrice[]>>((acc, row) => {
    (acc[row.table_group] ??= []).push(row);
    return acc;
  }, {});
  const groupNames = Object.keys(groups);

  return (
    <>
      <Section className="pt-0">
        <SectionHeading
          eyebrow="Latest Steel Price"
          title="Latest Steel Prices from SAMORE Company"
          description="For Revolving MT700 & SBLC. All prices are CIF."
        />

        <div className="mt-10 space-y-10">
          {groupNames.length === 0 ? (
            <EmptyPrices what="Steel prices" />
          ) : (
            groupNames.map((group) => (
              <Reveal key={group}>
                <div>
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {group}
                  </h3>
                  <div className="rounded-lg border border-border bg-card">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity (Ton)</TableHead>
                          <TableHead className="text-right">Price (USD/Ton)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groups[group].map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className="font-medium">{row.product}</TableCell>
                            <TableCell>{row.quantity}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {row.price_usd}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>

        {/* Verbatim terms */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-lg border border-border bg-card p-6">
              <p className="eyebrow mb-4">** All Prices Include: CIF prices</p>
              <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                {PRICE_INCLUDES.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="h-full rounded-lg border border-border bg-card p-6">
              <p className="eyebrow mb-4">Business Developing offers</p>
              <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                {BUSINESS_OFFERS.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="pt-0">
        <SectionHeading eyebrow="Purchase Procedure" title="Purchase Procedure" />
        <ol className="mt-10 space-y-4">
          {PURCHASE_PROCEDURE.map((step, i) => (
            <Reveal key={i} delay={i * 0.03}>
              <li className="flex gap-4 border-t border-border pt-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs text-white">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-foreground/90">{step}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section className="pt-0">
        <SectionHeading
          eyebrow="Specifications"
          title="Specifications"
          description="Manufacturer specification sheets as supplied with our steel offer."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {STEEL_SPECS.map((spec, i) => (
            <Reveal key={spec.src} delay={i * 0.03}>
              <figure className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="bg-white">
                  <Image
                    src={spec.src}
                    alt={spec.alt}
                    width={spec.w}
                    height={spec.h}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="h-auto w-full object-contain"
                  />
                </div>
                <figcaption className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
                  {spec.label}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

/* ─────────────────────────────── OIL ─────────────────────────────── */

export function OilTradeSection({ prices }: { prices: OilPrice[] }) {
  return (
    <>
      <Section className="pt-0">
        <SectionHeading
          eyebrow="Latest Prices"
          title="Latest Prices"
          description="Refinery-direct pricing. FOB and CIF in USD."
        />
        <div className="mt-10">
          {prices.length === 0 ? (
            <EmptyPrices what="Oil prices" />
          ) : (
            <div className="rounded-lg border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PRODUCT</TableHead>
                    <TableHead className="text-right">FOB USD</TableHead>
                    <TableHead className="text-right">CIF USD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prices.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.product}</TableCell>
                      <TableCell className="text-right">{row.fob_usd ?? "—"}</TableCell>
                      <TableCell className="text-right">{row.cif_usd ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <Reveal>
          <div className="mt-10 rounded-lg border border-border bg-card p-6">
            <p className="eyebrow mb-4">The Buyer ICPO Should Attached with</p>
            <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
              {ICPO_ATTACHMENTS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
            <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
              The Refinery does not reply to ICPO only, should be attached with the requested data.
            </p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
