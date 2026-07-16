import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/site/legal";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How SAMORE collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalDoc title="Privacy Policy" updated="15 July 2026">
      <LegalSection heading="Introduction">
        <p>
          {COMPANY.legalName} ("SAMORE", "we", "us") respects your privacy. This policy explains
          what information we collect through this website, how we use it, and the choices you
          have.
        </p>
      </LegalSection>

      <LegalSection heading="Information we collect">
        <ul>
          <li>Contact details you submit through our inquiry, newsletter and checkout forms — such as your name, company, email, phone number and message.</li>
          <li>Course enrollment and payment information, including the bank-transfer receipt you upload.</li>
          <li>Technical data such as IP address and basic request metadata, used for security and rate limiting.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="How we use your information">
        <ul>
          <li>To respond to your inquiries and provide the services you request.</li>
          <li>To process course enrollments, generate your Letter of Intent, and verify bank-transfer payments.</li>
          <li>To send transactional emails (registration, payment status, LOI) and, where you opt in, newsletters.</li>
          <li>To protect the website against spam and abuse.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Storage and processing">
        <p>
          Data submitted through this website is stored securely using Supabase (Postgres
          database and object storage) and, where email delivery is enabled, processed by Resend
          for transactional email. Uploaded receipts and generated documents are stored in
          private storage buckets accessible only to authorised administrators.
        </p>
      </LegalSection>

      <LegalSection heading="Data retention">
        <p>
          We retain personal information for as long as necessary to fulfil the purposes described
          in this policy or as required by applicable law. You may request deletion of your data
          at any time.
        </p>
      </LegalSection>

      <LegalSection heading="Your rights">
        <p>
          You may request access to, correction of, or deletion of your personal data by
          contacting us at <a href={COMPANY.emailHref}>{COMPANY.email}</a>. We will respond within
          a reasonable timeframe.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          For any privacy question, contact {COMPANY.contactPerson} at{" "}
          <a href={COMPANY.emailHref}>{COMPANY.email}</a> or {COMPANY.phone}.
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
