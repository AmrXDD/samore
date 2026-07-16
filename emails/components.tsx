import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { COMPANY, SITE_URL } from "@/lib/constants";

const main = {
  backgroundColor: "#FAF9F6",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "40px 0 64px",
  maxWidth: "560px",
};

const card = {
  backgroundColor: "#ffffff",
  border: "1px solid #eceae4",
  borderRadius: "12px",
  padding: "40px",
};

const brand = {
  fontSize: "18px",
  fontWeight: 700 as const,
  letterSpacing: "0.24em",
  color: "#000000",
  margin: "0 0 24px",
};

const footer = {
  fontSize: "12px",
  color: "#8a8a8a",
  lineHeight: "20px",
  marginTop: "24px",
  textAlign: "center" as const,
};

export function EmailLayout({
  preview,
  children,
}: {
  preview: string;
  children: ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            <Img
              src={`${SITE_URL}/samore-logo.png`}
              alt="SAMORE"
              width="34"
              height="35"
              style={{ display: "block", marginBottom: "12px" }}
            />
            <Text style={brand}>SAMORE</Text>
            {children}
          </Section>
          <Text style={footer}>
            {COMPANY.legalName}
            <br />
            {COMPANY.phone} · {COMPANY.email}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const text = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#000000",
  margin: "0 0 16px",
};

export const heading = {
  fontSize: "22px",
  fontWeight: 600 as const,
  letterSpacing: "-0.02em",
  color: "#000000",
  margin: "0 0 20px",
};

export const label = {
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.18em",
  color: "#8a8a8a",
  margin: "0 0 4px",
};

export const value = {
  fontSize: "15px",
  color: "#000000",
  margin: "0 0 16px",
};

export const divider = { borderColor: "#eceae4", margin: "24px 0" };

export function Field({ label: l, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Text style={label}>{l}</Text>
      <Text style={value}>{children}</Text>
    </>
  );
}

export { Hr };
