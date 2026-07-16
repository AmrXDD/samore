import { StatCard } from "@/components/admin/stat-card";
import { RevenueChart, OrdersChart } from "@/components/admin/charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMonthlyRevenue, getAllPayments, getDashboardStats } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";

export default async function AdminAnalyticsPage() {
  const [monthly, payments, stats] = await Promise.all([
    getMonthlyRevenue(),
    getAllPayments(),
    getDashboardStats(),
  ]);

  const approved = payments.filter((p) => p.status === "approved");
  const conversion = payments.length
    ? Math.round((approved.length / payments.length) * 100)
    : 0;
  const avgOrder = approved.length
    ? approved.reduce((s, p) => s + p.amount, 0) / approved.length
    : 0;

  // Top courses by approved revenue.
  const byCourse = new Map<string, { title: string; revenue: number; orders: number }>();
  for (const p of approved) {
    const title = p.course?.title ?? "—";
    const cur = byCourse.get(title) ?? { title, revenue: 0, orders: 0 };
    cur.revenue += p.amount;
    cur.orders += 1;
    byCourse.set(title, cur);
  }
  const topCourses = [...byCourse.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={formatCurrency(stats.total_sales)} />
        <StatCard label="Avg. Order Value" value={formatCurrency(avgOrder)} />
        <StatCard label="Conversion" value={`${conversion}%`} hint="Approved / total orders" />
        <StatCard label="Total Orders" value={payments.length} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-6 text-sm font-medium">Revenue — last 12 months</h2>
          {monthly.length ? <RevenueChart data={monthly} /> : <Empty />}
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-6 text-sm font-medium">Monthly orders</h2>
          {monthly.length ? <OrdersChart data={monthly} /> : <Empty />}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-6">
          <h2 className="text-sm font-medium">Top courses by revenue</h2>
        </div>
        {topCourses.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No approved orders yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCourses.map((c) => (
                <TableRow key={c.title}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell className="text-right">{c.orders}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(c.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
      No data yet
    </div>
  );
}
