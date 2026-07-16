"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  upsertSteelPrice,
  deleteSteelPrice,
  upsertOilPrice,
  deleteOilPrice,
} from "@/app/actions/admin";
import { initialActionState } from "@/lib/action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Field, SubmitButton } from "@/components/forms/form-primitives";
import type { SteelPrice, OilPrice } from "@/types";

export function TradePriceManager({
  steel,
  oil,
}: {
  steel: SteelPrice[];
  oil: OilPrice[];
}) {
  return (
    <Tabs defaultValue="steel">
      <TabsList>
        <TabsTrigger value="steel">Steel prices ({steel.length})</TabsTrigger>
        <TabsTrigger value="oil">Oil prices ({oil.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="steel">
        <SteelTable rows={steel} />
      </TabsContent>
      <TabsContent value="oil">
        <OilTable rows={oil} />
      </TabsContent>
    </Tabs>
  );
}

/* ─────────────────────────────── Steel ─────────────────────────────── */

function SteelTable({ rows }: { rows: SteelPrice[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SteelPrice | null>(null);
  const [pending, startTransition] = useTransition();
  const [state, action] = useActionState(upsertSteelPrice, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && state.message) {
      toast.success(state.message);
      setOpen(false);
      setEditing(null);
      formRef.current?.reset();
    } else if (state.message && !state.ok && !state.errors) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus className="h-4 w-4" /> Add steel price
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit steel price" : "Add steel price"}</DialogTitle>
            </DialogHeader>
            <form ref={formRef} action={action} className="space-y-5 pt-2">
              {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
              <Field label="Table group" htmlFor="tableGroup" required error={state.errors?.tableGroup}>
                <select
                  id="tableGroup"
                  name="tableGroup"
                  defaultValue={editing?.table_group ?? "Main Prices"}
                  className="flex h-11 w-full rounded-lg border border-input bg-card px-4 text-sm"
                >
                  <option value="Main Prices">Main Prices</option>
                  <option value="Small Quantities">Small Quantities</option>
                </select>
              </Field>
              <Field label="Product" htmlFor="product" required error={state.errors?.product}>
                <Input id="product" name="product" placeholder="Used Rails" defaultValue={editing?.product} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Quantity (Ton)" htmlFor="quantity" required error={state.errors?.quantity}>
                  <Input id="quantity" name="quantity" placeholder="700,000.00 or 1M" defaultValue={editing?.quantity} />
                </Field>
                <Field label="Price (USD/Ton)" htmlFor="priceUsd" required error={state.errors?.priceUsd}>
                  <Input id="priceUsd" name="priceUsd" placeholder="230.00" defaultValue={editing?.price_usd} />
                </Field>
              </div>
              <Field label="Sort order" htmlFor="sortOrder" error={state.errors?.sortOrder}>
                <Input id="sortOrder" name="sortOrder" type="number" min="0" defaultValue={editing?.sort_order ?? 0} />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isActive" defaultChecked={editing?.is_active ?? true} className="h-4 w-4" />
                Show on the website
              </label>
              <SubmitButton className="w-full">{editing ? "Save changes" : "Add price"}</SubmitButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border bg-card">
        {rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No steel prices yet. Add your first row.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Price USD</TableHead>
                <TableHead>Live</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-xs text-muted-foreground">{r.table_group}</TableCell>
                  <TableCell className="font-medium">{r.product}</TableCell>
                  <TableCell>{r.quantity}</TableCell>
                  <TableCell className="text-right font-semibold">{r.price_usd}</TableCell>
                  <TableCell>
                    <Badge variant={r.is_active ? "success" : "outline"}>
                      {r.is_active ? "Yes" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditing(r);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={pending}
                        onClick={() =>
                          startTransition(async () => {
                            await deleteSteelPrice(r.id);
                            toast.success("Row deleted.");
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────── Oil ──────────────────────────────── */

function OilTable({ rows }: { rows: OilPrice[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<OilPrice | null>(null);
  const [pending, startTransition] = useTransition();
  const [state, action] = useActionState(upsertOilPrice, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && state.message) {
      toast.success(state.message);
      setOpen(false);
      setEditing(null);
      formRef.current?.reset();
    } else if (state.message && !state.ok && !state.errors) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus className="h-4 w-4" /> Add oil price
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit oil price" : "Add oil price"}</DialogTitle>
            </DialogHeader>
            <form ref={formRef} action={action} className="space-y-5 pt-2">
              {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
              <Field label="Product" htmlFor="oilProduct" required error={state.errors?.product}>
                <Input id="oilProduct" name="product" placeholder="EN90" defaultValue={editing?.product} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="FOB USD" htmlFor="fobUsd" error={state.errors?.fobUsd}>
                  <Input id="fobUsd" name="fobUsd" placeholder="520/510" defaultValue={editing?.fob_usd ?? ""} />
                </Field>
                <Field label="CIF USD" htmlFor="cifUsd" error={state.errors?.cifUsd}>
                  <Input id="cifUsd" name="cifUsd" placeholder="530/520" defaultValue={editing?.cif_usd ?? ""} />
                </Field>
              </div>
              <Field label="Sort order" htmlFor="oilSortOrder" error={state.errors?.sortOrder}>
                <Input id="oilSortOrder" name="sortOrder" type="number" min="0" defaultValue={editing?.sort_order ?? 0} />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isActive" defaultChecked={editing?.is_active ?? true} className="h-4 w-4" />
                Show on the website
              </label>
              <SubmitButton className="w-full">{editing ? "Save changes" : "Add price"}</SubmitButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border bg-card">
        {rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No oil prices yet. Add your first row.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">FOB USD</TableHead>
                <TableHead className="text-right">CIF USD</TableHead>
                <TableHead>Live</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.product}</TableCell>
                  <TableCell className="text-right">{r.fob_usd ?? "—"}</TableCell>
                  <TableCell className="text-right">{r.cif_usd ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={r.is_active ? "success" : "outline"}>
                      {r.is_active ? "Yes" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditing(r);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={pending}
                        onClick={() =>
                          startTransition(async () => {
                            await deleteOilPrice(r.id);
                            toast.success("Row deleted.");
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
