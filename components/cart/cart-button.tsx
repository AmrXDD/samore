"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./cart-provider";

export function CartButton({ onNavigate }: { onNavigate?: () => void }) {
  const { count, ready } = useCart();

  return (
    <Link
      href="/cart"
      onClick={onNavigate}
      aria-label={`Cart${ready && count > 0 ? ` (${count} item${count === 1 ? "" : "s"})` : ""}`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-secondary"
    >
      <ShoppingCart className="h-5 w-5" />
      {ready && count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-medium text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
