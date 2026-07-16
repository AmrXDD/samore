import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllPayments } from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/utils";

type Customer = {
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  orders: number;
  spent: number;
  lastOrder: string;
};

export default async function AdminCustomersPage() {
  const payments = await getAllPayments();

  const map = new Map<string, Customer>();
  for (const p of payments) {
    const key = p.email.toLowerCase();
    const existing = map.get(key);
    const spent = p.status === "approved" ? p.amount : 0;
    if (existing) {
      existing.orders += 1;
      existing.spent += spent;
      if (new Date(p.created_at) > new Date(existing.lastOrder)) existing.lastOrder = p.created_at;
    } else {
      map.set(key, {
        name: p.customer_name,
        email: p.email,
        company: p.company,
        phone: p.phone,
        orders: 1,
        spent,
        lastOrder: p.created_at,
      });
    }
  }
  const customers = [...map.values()].sort(
    (a, b) => new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime(),
  );

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        All customers who have placed a course order, with lifetime value.
      </p>
      <div className="rounded-lg border border-border bg-card">
        {customers.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No customers yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className="text-right">Last order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.email}>
                  <TableCell>
                    <div className="font-medium">{c.name}</div>
                    <a
                      href={`mailto:${c.email}`}
                      className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                    >
                      {c.email}
                    </a>
                  </TableCell>
                  <TableCell className="text-sm">{c.company ?? "—"}</TableCell>
                  <TableCell className="text-sm">
                    {c.phone ? (
                      <a href={`tel:${c.phone}`} className="hover:underline underline-offset-2">
                        {c.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right">{c.orders}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(c.spent)}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatDate(c.lastOrder)}
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
