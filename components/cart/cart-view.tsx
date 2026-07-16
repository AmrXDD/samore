"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "./cart-provider";

export function CartView() {
  const { items, total, currency, setQuantity, remove, clear, ready } = useCart();

  if (!ready) {
    return <div className="h-40 animate-pulse rounded-lg bg-secondary" />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card py-24 text-center">
        <p className="text-lg font-medium">Your cart is empty.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse our professional engineering courses to get started.
        </p>
        <Button asChild className="mt-6">
          <Link href="/courses">Browse courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.courseId}
            className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <Link
                href={`/courses/${item.slug}`}
                className="font-medium leading-snug hover:underline underline-offset-4"
              >
                {item.title}
              </Link>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.code ? `${item.code} · ` : ""}
                {formatCurrency(item.price, item.currency)} each
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4">
              <div className="flex items-center rounded-lg border border-border">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity(item.courseId, item.quantity - 1)}
                  className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-secondary sm:h-9 sm:w-9"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity(item.courseId, item.quantity + 1)}
                  className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-secondary sm:h-9 sm:w-9"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <span className="shrink-0 font-semibold sm:w-24 sm:text-right">
                {formatCurrency(item.price * item.quantity, item.currency)}
              </span>

              <button
                type="button"
                aria-label={`Remove ${item.title}`}
                onClick={() => remove(item.courseId)}
                className="flex h-11 w-11 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-destructive sm:h-9 sm:w-9"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={clear}
          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Clear cart
        </button>
      </div>

      <aside className="h-fit rounded-lg border border-border bg-card p-6 lg:sticky lg:top-28">
        <h2 className="text-sm font-medium">Summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Items</dt>
            <dd>{items.reduce((s, i) => s + i.quantity, 0)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <dt className="text-muted-foreground">Total</dt>
            <dd className="text-2xl font-semibold tracking-tighter">
              {formatCurrency(total, currency)}
            </dd>
          </div>
        </dl>
        <Button asChild className="mt-6 w-full">
          <Link href="/checkout">
            Proceed to checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Bank transfer only · prices in USD
        </p>
      </aside>
    </div>
  );
}
