import { EmailLayout, Field, heading, text } from "./components";

export type PaymentPendingProps = {
  customerName: string;
  reference: string;
  amount: string;
  courseTitle: string;
};

export default function PaymentPending({
  customerName = "Jane Doe",
  reference = "SAM-PAY-XXXX",
  amount = "$1,500",
  courseTitle = "Value Engineering",
}: PaymentPendingProps) {
  return (
    <EmailLayout preview={`Payment received and pending verification — ${reference}`}>
      <p style={heading}>Payment pending verification</p>
      <p style={text}>
        Dear {customerName}, we have received your bank-transfer receipt for{" "}
        <strong>{courseTitle}</strong>. Our team is verifying the transfer and will
        confirm shortly.
      </p>
      <Field label="Reference">{reference}</Field>
      <Field label="Amount">{amount}</Field>
      <p style={text}>You will receive a confirmation email once approved.</p>
    </EmailLayout>
  );
}
