"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, X, ExternalLink, MoreHorizontal } from "lucide-react";
import { approvePayment, rejectPayment } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Payment } from "@/types";

export function PaymentActions({ payment }: { payment: Payment }) {
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<null | "approve" | "reject">(null);
  const [notes, setNotes] = useState("");

  const disabled = payment.status === "approved" || payment.status === "rejected";

  function run(kind: "approve" | "reject") {
    startTransition(async () => {
      if (kind === "approve") await approvePayment(payment.id, notes || undefined);
      else await rejectPayment(payment.id, notes || undefined);
      toast.success(kind === "approve" ? "Payment approved." : "Payment rejected.");
      setDialog(null);
      setNotes("");
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {payment.receipt_url ? (
            <DropdownMenuItem asChild>
              <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" /> View receipt
              </a>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={disabled} onSelect={() => setDialog("approve")}>
            <Check className="h-4 w-4" /> Approve
          </DropdownMenuItem>
          <DropdownMenuItem disabled={disabled} className="text-destructive" onSelect={() => setDialog("reject")}>
            <X className="h-4 w-4" /> Reject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialog !== null} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialog === "approve" ? "Approve payment" : "Reject payment"} — {payment.reference}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {dialog === "approve"
              ? "Confirming will unlock the course for the customer and send an approval email."
              : "The customer's enrollment will be marked as rejected."}
          </p>
          <Textarea
            placeholder="Internal notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button
              variant={dialog === "reject" ? "destructive" : "default"}
              disabled={pending}
              onClick={() => dialog && run(dialog)}
            >
              {dialog === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
