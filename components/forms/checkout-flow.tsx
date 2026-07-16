"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Copy, Download, Landmark, Upload } from "lucide-react";
import { createOrder, uploadReceipt } from "@/app/actions/checkout";
import { initialActionState } from "@/lib/action-state";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-provider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, Honeypot, SubmitButton } from "./form-primitives";
import type { BankSettings } from "@/types";

type Step = "info" | "payment" | "done";

export function CheckoutFlow({ bank }: { bank: BankSettings | null }) {
  const { items, total, currency, count, clear, ready } = useCart();
  const [step, setStep] = useState<Step>("info");
  const [order, setOrder] = useState<{ reference: string; loiUrl: string; amount: string } | null>(
    null,
  );

  const [orderState, orderAction] = useActionState(createOrder, initialActionState);
  const [receiptState, receiptAction] = useActionState(uploadReceipt, initialActionState);

  useEffect(() => {
    if (orderState.ok && orderState.data?.reference) {
      setOrder({
        reference: String(orderState.data.reference),
        loiUrl: String(orderState.data.loiUrl ?? ""),
        amount: String(orderState.data.amount ?? ""),
      });
      setStep("payment");
      clear();
      toast.success("Order created. Please complete your bank transfer.");
    } else if (orderState.message && !orderState.ok && !orderState.errors) {
      toast.error(orderState.message);
    }
  }, [orderState, clear]);

  useEffect(() => {
    if (receiptState.ok && receiptState.message) {
      setStep("done");
      toast.success(receiptState.message);
    } else if (receiptState.message && !receiptState.ok) {
      toast.error(receiptState.message);
    }
  }, [receiptState]);

  if (step === "done" && order) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10" />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Pending verification</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Your receipt for order{" "}
          <span className="font-medium text-foreground">{order.reference}</span> has been received.
          Once our team verifies the transfer, your course access is unlocked and we will contact
          you by email.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/courses">Back to courses</Link>
        </Button>
      </div>
    );
  }

  if (step === "payment" && order) {
    return (
      <div className="space-y-6">
        <StepIndicator current={2} />
        <div className="rounded-lg border border-border bg-card p-6 md:p-8">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Landmark className="h-4 w-4" /> Bank transfer instructions
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Transfer <span className="font-semibold text-foreground">{order.amount}</span> and quote
            reference <span className="font-semibold text-foreground">{order.reference}</span> on
            the transfer.
          </p>

          {bank && bank.is_active ? (
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <BankRow label="Bank" value={bank.bank_name} />
              <BankRow label="Beneficiary name" value={bank.account_name} />
              <BankRow label="Account number" value={bank.account_number} copyable />
              <BankRow label="IBAN" value={bank.iban} copyable />
              <BankRow label="SWIFT / BIC" value={bank.swift} copyable />
              <BankRow label="Branch" value={bank.branch} />
              <BankRow label="Currency" value={bank.currency} />
              <BankRow label="Reference" value={order.reference} copyable />
            </dl>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              Bank account details will be emailed to you. Keep your reference{" "}
              <span className="font-medium text-foreground">{order.reference}</span>.
            </p>
          )}

          {bank?.instructions ? (
            <p className="mt-6 whitespace-pre-line border-t border-border pt-5 text-sm text-muted-foreground">
              {bank.instructions}
            </p>
          ) : null}

          {order.loiUrl ? (
            <Button asChild variant="outline" size="sm" className="mt-6">
              <a href={order.loiUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" /> Download Letter of Intent
              </a>
            </Button>
          ) : null}
        </div>

        <form
          action={receiptAction}
          className="space-y-4 rounded-lg border border-border bg-card p-6 md:p-8"
        >
          <input type="hidden" name="reference" value={order.reference} />
          <div className="flex items-center gap-2 text-sm font-medium">
            <Upload className="h-4 w-4" /> Upload your payment receipt
          </div>
          <p className="text-sm text-muted-foreground">
            PNG, JPG, WEBP or PDF — maximum 10MB.
          </p>
          <input
            name="receipt"
            type="file"
            required
            accept="image/png,image/jpeg,image/webp,application/pdf"
            className="block w-full text-sm file:mr-4 file:rounded-lg file:border file:border-input file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-muted"
          />
          <SubmitButton>Submit receipt</SubmitButton>
        </form>
      </div>
    );
  }

  // Step 1 — details
  if (ready && count === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card py-20 text-center">
        <p className="text-lg font-medium">Your cart is empty.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a course to continue to checkout.
        </p>
        <Button asChild className="mt-6">
          <Link href="/courses">Browse courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StepIndicator current={1} />
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <form
          action={orderAction}
          className="relative space-y-5 rounded-lg border border-border bg-card p-6 md:p-8"
        >
          <Honeypot />
          <input
            type="hidden"
            name="items"
            value={JSON.stringify(
              items.map((i) => ({ courseId: i.courseId, quantity: i.quantity })),
            )}
          />
          <h2 className="text-lg font-semibold tracking-tight">Your details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="customerName" required error={orderState.errors?.customerName}>
              <Input id="customerName" name="customerName" autoComplete="name" />
            </Field>
            <Field label="Company" htmlFor="company" error={orderState.errors?.company}>
              <Input id="company" name="company" autoComplete="organization" />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" htmlFor="email" required error={orderState.errors?.email}>
              <Input id="email" name="email" type="email" autoComplete="email" />
            </Field>
            <Field label="Phone" htmlFor="phone" required error={orderState.errors?.phone}>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" />
            </Field>
          </div>
          <Field label="Notes" htmlFor="notes" error={orderState.errors?.notes}>
            <Textarea id="notes" name="notes" rows={3} placeholder="Preferred dates, language… (optional)" />
          </Field>
          <SubmitButton className="w-full">Place order & get bank details</SubmitButton>
          <p className="text-center text-xs text-muted-foreground">
            Payment is by bank transfer only. No card details are ever collected.
          </p>
        </form>

        {/* Order summary */}
        <aside className="h-fit rounded-lg border border-border bg-card p-6">
          <h2 className="text-sm font-medium">Order summary</h2>
          <ul className="mt-5 space-y-4">
            {items.map((i) => (
              <li key={i.courseId} className="flex justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-sm font-medium leading-snug">{i.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {i.code ? `${i.code} · ` : ""}Qty {i.quantity}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium">
                  {formatCurrency(i.price * i.quantity, i.currency)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-2xl font-semibold tracking-tighter">
              {formatCurrency(total, currency)}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function BankRow({
  label,
  value,
  copyable,
}: {
  label: string;
  value: string | null;
  copyable?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 flex items-center gap-2 text-sm font-medium">
        <span className="break-all">{value || "—"}</span>
        {copyable && value ? (
          <button
            type="button"
            aria-label={`Copy ${label}`}
            onClick={() => {
              void navigator.clipboard.writeText(value);
              toast.success(`${label} copied.`);
            }}
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </dd>
    </div>
  );
}

function StepIndicator({ current }: { current: 1 | 2 }) {
  const steps = ["Your details", "Payment & receipt"];
  return (
    <ol className="flex items-center gap-6 text-sm">
      {steps.map((label, i) => {
        const n = (i + 1) as 1 | 2;
        const active = n <= current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                active ? "bg-ink text-white" : "bg-secondary text-muted-foreground"
              }`}
            >
              {n}
            </span>
            <span className={active ? "font-medium" : "text-muted-foreground"}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
