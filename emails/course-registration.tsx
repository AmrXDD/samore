import { EmailLayout, Field, heading, text } from "./components";

export type CourseRegistrationProps = {
  customerName: string;
  courseTitle: string;
  reference: string;
  amount: string;
};

export default function CourseRegistration({
  customerName = "Jane Doe",
  courseTitle = "Value Engineering",
  reference = "SAM-PAY-XXXX",
  amount = "$1,500",
}: CourseRegistrationProps) {
  return (
    <EmailLayout preview={`Registration received — ${courseTitle}`}>
      <p style={heading}>Registration received</p>
      <p style={text}>
        Dear {customerName}, thank you for registering for <strong>{courseTitle}</strong>.
        Your enrollment is reserved. Please complete payment by bank transfer using the
        instructions provided at checkout, then upload your receipt.
      </p>
      <Field label="Course">{courseTitle}</Field>
      <Field label="Reference">{reference}</Field>
      <Field label="Amount">{amount}</Field>
      <p style={text}>
        Once your transfer is verified by our team, your course access will be unlocked.
      </p>
    </EmailLayout>
  );
}
