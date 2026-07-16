import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/site/legal";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of the SAMORE website and services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalDoc title="Terms of Service" updated="15 July 2026">
      <LegalSection heading="Acceptance of terms">
        <p>
          By accessing or using this website operated by {COMPANY.legalName} ("SAMORE"), you agree
          to these Terms of Service. If you do not agree, please do not use the site.
        </p>
      </LegalSection>

      <LegalSection heading="Services">
        <p>
          SAMORE provides engineering services, construction conflict solutions, engineering
          education and steel & oil trading. Information on this website is provided for general
          purposes and does not constitute a binding offer unless confirmed in a signed agreement.
        </p>
      </LegalSection>

      <LegalSection heading="Courses and payment">
        <ul>
          <li>Course enrollment is completed by submitting the checkout form and paying by bank transfer only. No card or online payment details are collected on this website.</li>
          <li>Upon checkout, a Letter of Intent is generated for your records. Course access is unlocked after we verify your bank transfer.</li>
          <li>Prices are shown in the stated currency and are exclusive of any bank charges incurred on your side, unless otherwise noted.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Trading inquiries">
        <p>
          Steel and oil trading terms, prices and procedures are commercial and are shared with
          verified buyers on request. Nothing on this website constitutes a binding trade offer;
          all transactions are governed by separately executed contracts (FCO, SPA, ICPO and
          related instruments).
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <ul>
          <li>Do not use the site for unlawful purposes or to submit false or misleading information.</li>
          <li>Do not attempt to disrupt, probe or gain unauthorised access to the site or its infrastructure.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Intellectual property">
        <p>
          All content on this website — text, graphics, logos and the SAMORE name — is the
          property of SAMORE and may not be reproduced without prior written permission.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          The website is provided "as is". To the fullest extent permitted by law, SAMORE shall
          not be liable for any indirect or consequential loss arising from use of the website.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about these terms may be directed to {COMPANY.contactPerson} at{" "}
          <a href={COMPANY.emailHref}>{COMPANY.email}</a>.
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
