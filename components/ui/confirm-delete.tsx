"use client";

import { useState, type ReactNode } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * Two-step guard for destructive actions: the trigger opens a confirmation
 * dialog, and nothing is deleted until the user explicitly confirms.
 * Deletions are permanent — there is no undo — so every delete in the admin
 * must go through this.
 */
export function ConfirmDelete({
  children,
  title = "Delete this item?",
  itemLabel,
  description = "This cannot be undone.",
  confirmLabel = "Delete permanently",
  onConfirm,
  pending = false,
  open: controlledOpen,
  onOpenChange,
}: {
  /** The trigger element (e.g. a trash Button). Omit when using controlled mode. */
  children?: ReactNode;
  title?: string;
  /** What is being deleted, shown back to the user so they can double-check. */
  itemLabel?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  pending?: boolean;
  /** Controlled mode — for triggers inside menus that close on select. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setUncontrolledOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {itemLabel ? (
          <div className="rounded-lg border border-border bg-secondary px-4 py-3 text-sm font-medium">
            {itemLabel}
          </div>
        ) : null}

        <p className="text-sm text-muted-foreground">{description}</p>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
