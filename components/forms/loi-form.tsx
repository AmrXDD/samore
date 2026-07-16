"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Download, FileText } from "lucide-react";
import { generatePurchaseLoi } from "@/app/actions/loi";
import { initialActionState } from "@/lib/action-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, Honeypot, SubmitButton } from "./form-primitives";

export function LoiForm() {
  const [state, action] = useActionState(generatePurchaseLoi, initialActionState);
  const [done, setDone] = useState<{ reference: string; loiUrl: string; subject: string } | null>(
    null,
  );

  useEffect(() => {
    if (state.ok && state.data?.reference) {
      setDone({
        reference: String(state.data.reference),
        loiUrl: String(state.data.loiUrl ?? ""),
        subject: String(state.data.subject ?? ""),
      });
      toast.success("Letter of Intent generated.");
    } else if (state.message && !state.ok && !state.errors) {
      toast.error(state.message);
    }
  }, [state]);

  if (done) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10" />
        <h3 className="mt-4 text-xl font-semibold">Your LOI is ready</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Reference <span className="font-medium text-foreground">{done.reference}</span> —{" "}
          {done.subject}. A copy has been emailed to you and to our trading desk.
        </p>
        {done.loiUrl ? (
          <Button asChild className="mt-6">
            <a href={done.loiUrl} target="_blank" rel="noopener noreferrer" download>
              <Download className="h-4 w-4" /> Download LOI (PDF)
            </a>
          </Button>
        ) : null}
        <div>
          <Button variant="ghost" className="mt-3" onClick={() => setDone(null)}>
            Create another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="relative space-y-5 rounded-lg border border-border bg-card p-6 md:p-8">
      <Honeypot />
      <div className="flex items-center gap-2 text-sm font-medium">
        <FileText className="h-4 w-4" /> Purchase Letter of Intent
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="customerName" required error={state.errors?.customerName}>
          <Input id="customerName" name="customerName" autoComplete="name" />
        </Field>
        <Field label="Company" htmlFor="company" required error={state.errors?.company}>
          <Input id="company" name="company" autoComplete="organization" />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" required error={state.errors?.email}>
          <Input id="email" name="email" type="email" autoComplete="email" />
        </Field>
        <Field label="Phone" htmlFor="phone" required error={state.errors?.phone}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Commodity" htmlFor="commodity" required error={state.errors?.commodity}>
          <select
            id="commodity"
            name="commodity"
            defaultValue="Steel"
            className="flex h-11 w-full rounded-lg border border-input bg-card px-4 text-sm"
          >
            <option value="Steel">Steel</option>
            <option value="Oil">Oil</option>
          </select>
        </Field>
        <Field label="Product" htmlFor="product" required error={state.errors?.product}>
          <Input id="product" name="product" placeholder="e.g. Steel Billet, EN90, Rebar…" />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Quantity (ton)" htmlFor="quantity" required error={state.errors?.quantity}>
          <Input id="quantity" name="quantity" placeholder="e.g. 100,000" />
        </Field>
        <Field label="Monthly delivery" htmlFor="monthlyDelivery" error={state.errors?.monthlyDelivery}>
          <Input id="monthlyDelivery" name="monthlyDelivery" placeholder="e.g. 50,000 ton / month" />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Discharge port" htmlFor="port" error={state.errors?.port}>
          <Input id="port" name="port" placeholder="e.g. Jebel Ali" />
        </Field>
        <Field label="Country" htmlFor="country" error={state.errors?.country}>
          <Input id="country" name="country" placeholder="Destination country" />
        </Field>
      </div>
      <Field label="Notes" htmlFor="notes" error={state.errors?.notes}>
        <Textarea id="notes" name="notes" rows={3} placeholder="Anything else we should know? (optional)" />
      </Field>

      <SubmitButton className="w-full">Generate Letter of Intent</SubmitButton>
      <p className="text-center text-xs text-muted-foreground">
        Generating an LOI expresses purchase intent and does not create a binding contract.
        Payment and settlement are by bank instrument / transfer only.
      </p>
    </form>
  );
}
