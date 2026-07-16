import "server-only";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { COMPANY } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

export type LoiData = {
  reference: string;
  date?: Date;
  customerName: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  subject: string;
  quantity?: string | null;
  amount?: number | null;
  currency?: string;
  // Optional trading fields (Purchase LOI for steel / oil).
  product?: string | null;
  monthlyDelivery?: string | null;
  port?: string | null;
  country?: string | null;
};

const BLACK = rgb(0, 0, 0);
const GREY = rgb(0.42, 0.42, 0.42);
const CANVAS = rgb(0.98, 0.976, 0.965);

/**
 * Generates a professional Letter of Intent PDF matching SAMORE's LOI template.
 * Returns the raw PDF bytes.
 */
export async function generateLoiPdf(data: LoiData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`SAMORE Letter of Intent — ${data.reference}`);
  doc.setAuthor(COMPANY.name);
  doc.setSubject("Letter of Intent");

  const page = doc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const margin = 56;
  let y = height - margin;

  // Canvas background band at top
  page.drawRectangle({ x: 0, y: height - 130, width, height: 130, color: CANVAS });

  // Brand
  page.drawText("SAMORE", {
    x: margin,
    y: y - 6,
    size: 22,
    font: bold,
    color: BLACK,
  });
  page.drawText(COMPANY.legalName, {
    x: margin,
    y: y - 26,
    size: 8,
    font,
    color: GREY,
  });
  page.drawText(`${COMPANY.phone}   ·   ${COMPANY.email}`, {
    x: margin,
    y: y - 40,
    size: 8,
    font,
    color: GREY,
  });

  y = height - 160;

  // Title
  page.drawText("LETTER OF INTENT", {
    x: margin,
    y,
    size: 16,
    font: bold,
    color: BLACK,
  });
  y -= 18;
  page.drawText(`Reference: ${data.reference}`, { x: margin, y, size: 9, font, color: GREY });
  page.drawText(`Date: ${formatDate(data.date ?? new Date())}`, {
    x: width - margin - 140,
    y,
    size: 9,
    font,
    color: GREY,
  });
  y -= 28;

  const line = (label: string, val: string) => {
    page.drawText(label.toUpperCase(), { x: margin, y, size: 8, font: bold, color: GREY});
    page.drawText(val || "—", { x: margin + 130, y, size: 11, font, color: BLACK });
    y -= 22;
  };

  // From
  page.drawText("FROM (BUYER)", { x: margin, y, size: 9, font: bold, color: BLACK});
  y -= 20;
  line("Name", data.customerName);
  if (data.company) line("Company", data.company);
  line("Email", data.email);
  if (data.phone) line("Phone", data.phone);
  y -= 8;

  // To
  page.drawText("TO (BENEFICIARY)", { x: margin, y, size: 9, font: bold, color: BLACK});
  y -= 20;
  line("Company", COMPANY.legalName);
  line("Attn", COMPANY.contactPerson);
  line("Email", COMPANY.email);
  y -= 8;

  // Subject / commitment
  page.drawText("SUBJECT", { x: margin, y, size: 9, font: bold, color: BLACK});
  y -= 20;
  line("Purchase Order", data.subject);
  if (data.product) line("Product", data.product);
  if (data.quantity) line("Quantity", data.quantity);
  if (data.monthlyDelivery) line("Monthly Delivery", data.monthlyDelivery);
  if (data.port) line("Port", data.port);
  if (data.country) line("Country", data.country);
  if (data.amount != null) line("Amount", formatCurrency(data.amount, data.currency ?? "USD"));
  y -= 8;

  const paragraph =
    "We hereby confirm our intent and financial ability to proceed with the above purchase order under the terms and procedures of SAMORE. Kindly issue the proforma invoice and purchase contract to the account detailed below. This Letter of Intent is issued in good faith and does not by itself constitute a binding contract until definitive agreements are executed by both parties.";
  const words = paragraph.split(" ");
  const maxWidth = width - margin * 2;
  let lineStr = "";
  page.drawText("DECLARATION", { x: margin, y, size: 9, font: bold, color: BLACK});
  y -= 18;
  for (const w of words) {
    const test = lineStr ? `${lineStr} ${w}` : w;
    if (font.widthOfTextAtSize(test, 10) > maxWidth) {
      page.drawText(lineStr, { x: margin, y, size: 10, font, color: BLACK });
      y -= 15;
      lineStr = w;
    } else {
      lineStr = test;
    }
  }
  if (lineStr) {
    page.drawText(lineStr, { x: margin, y, size: 10, font, color: BLACK });
    y -= 15;
  }

  // Signature block
  y = 150;
  page.drawLine({ start: { x: margin, y }, end: { x: margin + 180, y }, thickness: 0.75, color: BLACK });
  page.drawLine({ start: { x: width - margin - 180, y }, end: { x: width - margin, y }, thickness: 0.75, color: BLACK });
  page.drawText("Buyer — Name / Sign / Stamp", { x: margin, y: y - 14, size: 8, font, color: GREY });
  page.drawText("For SAMORE", { x: width - margin - 180, y: y - 14, size: 8, font, color: GREY });

  // Footer
  page.drawText(
    `${COMPANY.legalName} · ${COMPANY.domain}`,
    { x: margin, y: 40, size: 7.5, font, color: GREY },
  );

  return doc.save();
}
