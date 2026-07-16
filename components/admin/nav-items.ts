import {
  LayoutDashboard,
  GraduationCap,
  Boxes,
  Users,
  CreditCard,
  Mail,
  FileText,
  Shield,
  Settings,
  BarChart3,
  Tags,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
};

/** Single source of truth for the admin navigation (desktop sidebar + mobile drawer). */
export const ADMIN_NAV: AdminNavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { title: "Courses", href: "/admin/courses", icon: GraduationCap },
  { title: "Services", href: "/admin/services", icon: Boxes },
  { title: "Trade Prices", href: "/admin/trade-prices", icon: Tags },
  { title: "Customers", href: "/admin/customers", icon: Users },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Emails", href: "/admin/emails", icon: Mail },
  { title: "LOI", href: "/admin/loi", icon: FileText },
  { title: "Users", href: "/admin/users", icon: Shield },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export function isNavActive(pathname: string, item: AdminNavItem): boolean {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}
