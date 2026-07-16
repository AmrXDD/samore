import {
  DollarSign,
  GraduationCap,
  Mail,
  FileText,
  Clock,
  CheckCircle2,
  Users,
  MessageSquare,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { RevenueChart, OrdersChart } from "@/components/admin/charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getDashboardStats,
  getRecentPayments,
  getActivity,
  getMonthlyRevenue,
} from "@/lib/queries";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

export default async function AdminDashboard() {
  const [stats, payments, activity, monthly] = await Promise.all([
    getDashboardStats(),
    getRecentPayments(6),
    getActivity(10),
    getMonthlyRevenue(),
  ]);

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Sales" value={formatCurrency(stats.total_sales)} icon={DollarSign} hint="Approved payments" />
        <StatCard label="Registered Courses" value={stats.total_courses} icon={GraduationCap} />
        <StatCard label="Registered Emails" value={stats.total_emails} icon={Mail} hint="Newsletter subscribers" />
        <StatCard label="LOI Generated" value={stats.total_loi} icon={FileText} />
        <StatCard label="Pending Payments" value={stats.pending_payments} icon={Clock} />
        <StatCard label="Approved Payments" value={stats.approved_payments} icon={CheckCircle2} />
        <StatCard label="Customers" value={stats.total_customers} icon={Users} />
        <StatCard label="Contact Messages" value={stats.total_messages} icon={MessageSquare} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-6 text-sm font-medium">Revenue — last 12 months</h2>
          {monthly.length ? (
            <RevenueChart data={monthly} />
          ) : (
            <EmptyChart label="No revenue data yet" />
          )}
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-6 text-sm font-medium">Monthly orders</h2>
          {monthly.length ? (
            <OrdersChart data={monthly} />
          ) : (
            <EmptyChart label="No orders yet" />
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Recent customers / payments */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-6">
            <h2 className="text-sm font-medium">Recent customers</h2>
          </div>
          {payments.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.customer_name}</div>
                      <a
                        href={`mailto:${p.email}`}
                        className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                      >
                        {p.email}
                      </a>
                    </TableCell>
                    <TableCell className="text-sm">
                      {p.items && p.items.length > 0
                        ? p.items.length === 1
                          ? p.items[0].title
                          : `${p.items.length} courses`
                        : (p.course?.title ?? "—")}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(p.amount, p.currency)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {formatDate(p.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Latest activity */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-6">
            <h2 className="text-sm font-medium">Latest activity</h2>
          </div>
          <ul className="divide-y divide-border">
            {activity.length === 0 ? (
              <li className="p-6 text-sm text-muted-foreground">No activity recorded.</li>
            ) : (
              activity.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 p-4 px-6">
                  <div>
                    <p className="text-sm font-medium">{a.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.actor ?? "system"} · {a.entity ?? "—"}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDateTime(a.created_at)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
