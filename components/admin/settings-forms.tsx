"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  saveBankSettings,
  saveHero,
  saveCompanySettings,
  saveSeo,
} from "@/app/actions/admin";
import { initialActionState } from "@/lib/action-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, SubmitButton } from "@/components/forms/form-primitives";
import type { BankSettings, HeroContent } from "@/types";

function useToast(state: { ok: boolean; message: string; errors?: unknown }) {
  useEffect(() => {
    if (state.ok && state.message) toast.success(state.message);
    else if (state.message && !state.ok && !state.errors) toast.error(state.message);
  }, [state]);
}

export function CompanyForm({ value }: { value: Record<string, unknown> | null }) {
  const [state, action] = useActionState(saveCompanySettings, initialActionState);
  useToast(state);
  const v = (value ?? {}) as Record<string, string>;
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company name" htmlFor="name" error={state.errors?.name}>
          <Input id="name" name="name" defaultValue={v.name ?? "SAMORE"} />
        </Field>
        <Field label="Legal name" htmlFor="legalName" error={state.errors?.legalName}>
          <Input id="legalName" name="legalName" defaultValue={v.legalName ?? ""} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" error={state.errors?.email}>
          <Input id="email" name="email" type="email" defaultValue={v.email ?? ""} />
        </Field>
        <Field label="Phone" htmlFor="phone" error={state.errors?.phone}>
          <Input id="phone" name="phone" defaultValue={v.phone ?? ""} />
        </Field>
      </div>
      <Field label="Address" htmlFor="address" error={state.errors?.address}>
        <Input id="address" name="address" defaultValue={v.address ?? ""} />
      </Field>
      <Field label="Logo URL" htmlFor="logoUrl" error={state.errors?.logoUrl}>
        <Input id="logoUrl" name="logoUrl" placeholder="https://…" defaultValue={v.logoUrl ?? ""} />
      </Field>
      <SubmitButton>Save company details</SubmitButton>
    </form>
  );
}

export function BankForm({ value }: { value: BankSettings | null }) {
  const [state, action] = useActionState(saveBankSettings, initialActionState);
  useToast(state);
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Bank name" htmlFor="bankName" error={state.errors?.bankName}>
          <Input id="bankName" name="bankName" defaultValue={value?.bank_name ?? ""} />
        </Field>
        <Field label="Account name" htmlFor="accountName" error={state.errors?.accountName}>
          <Input id="accountName" name="accountName" defaultValue={value?.account_name ?? ""} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Account number" htmlFor="accountNumber" error={state.errors?.accountNumber}>
          <Input id="accountNumber" name="accountNumber" defaultValue={value?.account_number ?? ""} />
        </Field>
        <Field label="IBAN" htmlFor="iban" error={state.errors?.iban}>
          <Input id="iban" name="iban" defaultValue={value?.iban ?? ""} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="SWIFT / BIC" htmlFor="swift" error={state.errors?.swift}>
          <Input id="swift" name="swift" defaultValue={value?.swift ?? ""} />
        </Field>
        <Field label="Branch" htmlFor="branch" error={state.errors?.branch}>
          <Input id="branch" name="branch" defaultValue={value?.branch ?? ""} />
        </Field>
        <Field label="Currency" htmlFor="currency" error={state.errors?.currency}>
          <Input id="currency" name="currency" maxLength={3} defaultValue={value?.currency ?? "USD"} />
        </Field>
      </div>
      <Field label="Instructions" htmlFor="instructions" error={state.errors?.instructions}>
        <Textarea
          id="instructions"
          name="instructions"
          rows={3}
          placeholder="Shown to customers at checkout"
          defaultValue={value?.instructions ?? ""}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={value?.is_active ?? true} className="h-4 w-4" />
        Show these details to customers at checkout
      </label>
      <SubmitButton>Save bank details</SubmitButton>
    </form>
  );
}

export function HeroForm({ value }: { value: HeroContent | null }) {
  const [state, action] = useActionState(saveHero, initialActionState);
  useToast(state);
  return (
    <form action={action} className="space-y-5">
      <Field label="Eyebrow" htmlFor="eyebrow" error={state.errors?.eyebrow}>
        <Input id="eyebrow" name="eyebrow" defaultValue={value?.eyebrow ?? ""} placeholder="Engineering services and Steel & Oil Trading" />
      </Field>
      <Field label="Headline" htmlFor="headline" required error={state.errors?.headline}>
        <Input id="headline" name="headline" defaultValue={value?.headline ?? ""} placeholder="Engineering excellence. Steel & oil, sourced direct." />
      </Field>
      <Field label="Subheadline" htmlFor="subheadline" error={state.errors?.subheadline}>
        <Textarea id="subheadline" name="subheadline" rows={3} defaultValue={value?.subheadline ?? ""} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="CTA label" htmlFor="ctaLabel" error={state.errors?.ctaLabel}>
          <Input id="ctaLabel" name="ctaLabel" defaultValue={value?.cta_label ?? ""} placeholder="Explore services" />
        </Field>
        <Field label="CTA link" htmlFor="ctaHref" error={state.errors?.ctaHref}>
          <Input id="ctaHref" name="ctaHref" defaultValue={value?.cta_href ?? ""} placeholder="/engineering-construction" />
        </Field>
      </div>
      <SubmitButton>Save homepage hero</SubmitButton>
    </form>
  );
}

export function SeoForm() {
  const [state, action] = useActionState(saveSeo, initialActionState);
  useToast(state);
  return (
    <form action={action} className="space-y-5">
      <Field label="Path" htmlFor="path" required error={state.errors?.path}>
        <Input id="path" name="path" placeholder="/ or /about" />
      </Field>
      <Field label="Title" htmlFor="title" error={state.errors?.title}>
        <Input id="title" name="title" placeholder="Page title" />
      </Field>
      <Field label="Description" htmlFor="description" error={state.errors?.description}>
        <Textarea id="description" name="description" rows={3} placeholder="Meta description" />
      </Field>
      <Field label="OG image URL" htmlFor="ogImage" error={state.errors?.ogImage}>
        <Input id="ogImage" name="ogImage" placeholder="https://…" />
      </Field>
      <SubmitButton>Save SEO override</SubmitButton>
    </form>
  );
}
