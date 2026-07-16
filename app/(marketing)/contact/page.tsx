import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { ContactForm } from "@/components/forms/contact-form";
import { COMPANY, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact SAMORE for engineering services, construction conflict solutions, courses, and steel & oil trading inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact SAMORE",
    url: `${SITE_URL}/contact`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow="Contact"
        title="Let's talk."
        lede="Tell us about your project, claim, course or trade inquiry. We respond promptly."
      />

      <Section>
        <div className="grid gap-16 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-8">
            <ContactItem icon={<Phone className="h-5 w-5" />} label="Phone" value={COMPANY.phone} href={COMPANY.phoneHref} />
            <ContactItem icon={<Mail className="h-5 w-5" />} label="Email" value={COMPANY.email} href={COMPANY.emailHref} />
            <ContactItem icon={<Mail className="h-5 w-5" />} label="Sales" value={COMPANY.salesEmail} href={`mailto:${COMPANY.salesEmail}`} />
            <ContactItem icon={<MapPin className="h-5 w-5" />} label="Company" value={COMPANY.legalName} />
            <p className="border-t border-border pt-6 text-sm text-muted-foreground">
              Attn: {COMPANY.contactPerson}. Course and trade payments are settled by bank
              transfer only.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-8 md:p-10">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const body = (
    <div className="flex items-start gap-4">
      <span className="mt-0.5 text-foreground">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-1 font-medium">{value}</p>
      </div>
    </div>
  );
  if (href) {
    return (
      <a href={href} className="block transition-opacity hover:opacity-70">
        {body}
      </a>
    );
  }
  return body;
}
