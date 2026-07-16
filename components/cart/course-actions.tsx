"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "./cart-provider";
import { cn } from "@/lib/utils";

type Props = {
  item: Omit<CartItem, "quantity">;
  /** Compact layout for course cards in a grid. */
  compact?: boolean;
  className?: string;
};

export function CourseActions({ item, compact = false, className }: Props) {
  const { add, has, ready } = useCart();
  const router = useRouter();
  const inCart = ready && has(item.courseId);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    add(item);
    toast.success(`${item.title} added to cart.`);
  }

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!has(item.courseId)) add(item);
    router.push("/checkout");
  }

  return (
    <div className={cn("flex gap-2", compact ? "flex-row" : "flex-col", className)}>
      <Button
        variant="outline"
        size={compact ? "sm" : "default"}
        onClick={handleAdd}
        className={compact ? "flex-1" : "w-full"}
        aria-label={`Add ${item.title} to cart`}
      >
        {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
        {inCart ? "In cart" : "Add to cart"}
      </Button>
      <Button
        size={compact ? "sm" : "default"}
        onClick={handleBuyNow}
        className={compact ? "flex-1" : "w-full"}
        aria-label={`Buy ${item.title} now`}
      >
        <Zap className="h-4 w-4" />
        Buy now
      </Button>
    </div>
  );
}
