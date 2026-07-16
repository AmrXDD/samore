"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Search, Download, Eye, Trash2 } from "lucide-react";
import { deleteLoi } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Loi } from "@/types";

export function LoiManager({ lois }: { lois: Loi[] }) {
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<Loi | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return lois;
    return lois.filter((l) =>
      [l.reference, l.customer_name, l.email, l.company, l.subject]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q)),
    );
  }, [lois, query]);

  return (
    <div className="space-y-6">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search LOIs…"
          className="pl-9"
        />
      </div>

      <div className="rounded-lg border border-border bg-card">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No letters of intent found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
                <TableHead className="w-32" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-mono text-xs">{l.reference}</TableCell>
                  <TableCell>
                    <div className="font-medium">{l.customer_name}</div>
                    <a
                      href={`mailto:${l.email}`}
                      className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                    >
                      {l.email}
                    </a>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate text-sm">{l.subject}</TableCell>
                  <TableCell className="text-right">
                    {l.amount != null ? formatCurrency(l.amount, l.currency) : "—"}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatDate(l.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {l.pdf_url ? (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => setPreview(l)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <a href={l.pdf_url} download target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </>
                      ) : null}
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={pending}
                        onClick={() =>
                          startTransition(async () => {
                            await deleteLoi(l.id);
                            toast.success("LOI deleted.");
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

      <Dialog open={preview !== null} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{preview?.reference}</DialogTitle>
          </DialogHeader>
          {preview?.pdf_url ? (
            <iframe
              src={preview.pdf_url}
              className="h-[70vh] w-full rounded-lg border border-border"
              title={`LOI ${preview.reference}`}
            />
          ) : (
            <p className="text-sm text-muted-foreground">No PDF available.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
