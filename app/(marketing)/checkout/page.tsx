import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { CheckoutFlow } from "@/components/forms/checkout-flow";
import { getBankSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your SAMORE course enrollment by bank transfer.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const bank = await getBankSettings();

  return (
    <>
      <PageHero
        eyebrow="Courses"
        title="Checkout"
        lede="Complete your details to place the order. You will receive bank transfer instructions and your Letter of Intent immediately."
        crumbs={[{ title: "Cart", href: "/cart" }]}
      />
      <Section>
        <CheckoutFlow bank={bank} />
      </Section>
    </>
  );
}
