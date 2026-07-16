import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceView } from "@/components/service/service-view";
import { SteelTradeSection, OilTradeSection } from "@/components/trade/trade-sections";
import { getService } from "@/lib/services";
import { getSteelPrices, getOilPrices } from "@/lib/queries";
import { allServiceSlugs, SITE_URL } from "@/lib/constants";

export function generateStaticParams() {
  return allServiceSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
// Trade prices are admin-editable — refresh the static pages periodically.
export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: service.seo.title,
    description: service.seo.description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: `${service.seo.title} — SAMORE`,
      description: service.seo.description,
      url: `${SITE_URL}/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.seo.title} — SAMORE`,
      description: service.seo.description,
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  // Live, admin-editable price tables for the two trading pages.
  let extras: React.ReactNode = null;
  if (slug === "steel-trading") {
    extras = <SteelTradeSection prices={await getSteelPrices()} />;
  } else if (slug === "oil-trading") {
    extras = <OilTradeSection prices={await getOilPrices()} />;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.seo.description,
    provider: {
      "@type": "Organization",
      name: "SAMORE",
      url: SITE_URL,
    },
    areaServed: "Worldwide",
    url: `${SITE_URL}/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiceView service={service} extras={extras} />
    </>
  );
}
