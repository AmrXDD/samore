import { EmailLayout, Field, heading, text } from "./components";

export type ContactNotificationProps = {
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  inquiryType: string;
  message: string;
};

export default function ContactNotification({
  name = "Jane Doe",
  email = "jane@example.com",
  company = "Acme Contracting",
  phone = "+965 0000 0000",
  inquiryType = "General Inquiry",
  message = "We would like to discuss a project.",
}: ContactNotificationProps) {
  return (
    <EmailLayout preview={`New inquiry from ${name}`}>
      <p style={heading}>New contact inquiry</p>
      <p style={text}>You received a new inquiry through samore-eng.com.</p>
      <Field label="Name">{name}</Field>
      <Field label="Email">{email}</Field>
      {company ? <Field label="Company">{company}</Field> : null}
      {phone ? <Field label="Phone">{phone}</Field> : null}
      <Field label="Inquiry Type">{inquiryType}</Field>
      <Field label="Message">{message}</Field>
    </EmailLayout>
  );
}
