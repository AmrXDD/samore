import { EmailLayout, Field, heading, text } from "./components";

export type PaymentApprovedProps = {
  customerName: string;
  reference: string;
  courseTitle: string;
};

export default function PaymentApproved({
  customerName = "Jane Doe",
  reference = "SAM-PAY-XXXX",
  courseTitle = "Value Engineering",
}: PaymentApprovedProps) {
  return (
    <EmailLayout preview={`Payment approved — ${courseTitle}`}>
      <p style={heading}>Payment approved</p>
      <p style={text}>
        Dear {customerName}, your payment for <strong>{courseTitle}</strong> has been
        verified and approved. Your enrollment is now confirmed.
      </p>
      <Field label="Course">{courseTitle}</Field>
      <Field label="Reference">{reference}</Field>
      <p style={text}>
        Our team will contact you with the schedule and access details. Thank you for
        choosing SAMORE.
      </p>
    </EmailLayout>
  );
}
