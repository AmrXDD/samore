"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { submitContact } from "@/app/actions/contact";
import { initialActionState } from "@/lib/action-state";
import { INQUIRY_TYPES } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, Honeypot, SubmitButton } from "./form-primitives";

export function ContactForm({ defaultInquiry }: { defaultInquiry?: string }) {
  const [state, formAction] = useActionState(submitContact, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success(state.message);
      formRef.current?.reset();
    } else if (!state.errors) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="relative space-y-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" required error={state.errors?.name}>
          <Input id="name" name="name" placeholder="Your full name" autoComplete="name" />
        </Field>
        <Field label="Company" htmlFor="company" error={state.errors?.company}>
          <Input id="company" name="company" placeholder="Company (optional)" autoComplete="organization" />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" required error={state.errors?.email}>
          <Input id="email" name="email" type="email" placeholder="you@company.com" autoComplete="email" />
        </Field>
        <Field label="Phone" htmlFor="phone" error={state.errors?.phone}>
          <Input id="phone" name="phone" type="tel" placeholder="+965 …" autoComplete="tel" />
        </Field>
      </div>
      <Field label="Inquiry type" htmlFor="inquiryType" required error={state.errors?.inquiryType}>
        <select
          id="inquiryType"
          name="inquiryType"
          defaultValue={defaultInquiry ?? INQUIRY_TYPES[0]}
          className="flex h-11 w-full rounded-lg border border-input bg-card px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {INQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Message" htmlFor="message" required error={state.errors?.message}>
        <Textarea id="message" name="message" placeholder="How can we help?" rows={5} />
      </Field>
      <SubmitButton className="w-full sm:w-auto">Send message</SubmitButton>
    </form>
  );
}
