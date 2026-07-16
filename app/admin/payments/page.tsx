import { PaymentActions } from "@/components/admin/payment-actions";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAllPayments } from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Payment } from "@/types";

export default async function AdminPaymentsPage() {
  const payments = await getAllPayments();
  const pending = payments.filter((p) => p.status === "pending" || p.status === "submitted");
  const approved = payments.filter((p) => p.status === "approved");
  const rejected = payments.filter((p) => p.status === "rejected");

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Review bank-transfer payments, inspect uploaded receipts, and approve or reject.
      </p>
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
          <TabsTrigger value="all">All ({payments.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending"><PaymentTable rows={pending} /></TabsContent>
        <TabsContent value="approved"><PaymentTable rows={approved} /></TabsContent>
        <TabsContent value="rejected"><PaymentTable rows={rejected} /></TabsContent>
        <TabsContent value="all"><PaymentTable rows={payments} /></TabsContent>
      </Tabs>
    </div>
  );
}

function PaymentTable({ rows }: { rows: Payment[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No payments in this view.
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Course</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Receipt</TableHead>
            <TableHead className="text-right">Date</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono text-xs">{p.reference}</TableCell>
              <TableCell>
                <div className="font-medium">{p.customer_name}</div>
                <a
                  href={`mailto:${p.email}`}
                  className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                >
                  {p.email}
                </a>
                {p.phone ? (
                  <div className="text-xs text-muted-foreground">
                    <a href={`tel:${p.phone}`} className="hover:text-foreground">
                      {p.phone}
                    </a>
                  </div>
                ) : null}
              </TableCell>
              <TableCell className="max-w-[280px] text-sm">
                {p.items && p.items.length > 0 ? (
                  <ul className="space-y-0.5">
                    {p.items.map((it) => (
                      <li key={it.id} className="truncate">
                        {it.code ? (
                          <span className="mr-1 font-mono text-xs text-muted-foreground">
                            {it.code}
                          </span>
                        ) : null}
                        {it.title}
                        {it.quantity > 1 ? (
                          <span className="text-muted-foreground"> × {it.quantity}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  (p.course?.title ?? "—")
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(p.amount, p.currency)}
              </TableCell>
              <TableCell><StatusBadge status={p.status} /></TableCell>
              <TableCell>
                {p.receipt_url ? (
                  <a
                    href={p.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline underline-offset-4"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {formatDate(p.created_at)}
              </TableCell>
              <TableCell><PaymentActions payment={p} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
