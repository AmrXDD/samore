import { Button, Section } from "@react-email/components";
import { EmailLayout, Field, heading, text } from "./components";

export type LoiReadyProps = {
  customerName: string;
  reference: string;
  subject: string;
  downloadUrl: string;
};

const button = {
  backgroundColor: "#000000",
  color: "#ffffff",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: 600 as const,
  textDecoration: "none",
  padding: "14px 28px",
  display: "inline-block",
};

export default function LoiReady({
  customerName = "Jane Doe",
  reference = "SAM-LOI-XXXX",
  subject = "Purchase Order",
  downloadUrl = "https://samore-eng.com",
}: LoiReadyProps) {
  return (
    <EmailLayout preview={`Your Letter of Intent is ready — ${reference}`}>
      <p style={heading}>Your Letter of Intent is ready</p>
      <p style={text}>
        Dear {customerName}, your Letter of Intent has been generated and is ready to
        download.
      </p>
      <Field label="Reference">{reference}</Field>
      <Field label="Subject">{subject}</Field>
      <Section style={{ marginTop: "24px" }}>
        <Button href={downloadUrl} style={button}>
          Download LOI (PDF)
        </Button>
      </Section>
    </EmailLayout>
  );
}
