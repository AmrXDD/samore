import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your selected SAMORE engineering courses.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <PageHero eyebrow="Courses" title="Your cart" lede="Review your selected courses, then continue to checkout. Payment is by bank transfer only." />
      <Section>
        <CartView />
      </Section>
    </>
  );
}
