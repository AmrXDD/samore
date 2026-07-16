"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { AdminMobileNav } from "./mobile-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initials } from "@/lib/utils";

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/courses": "Courses",
  "/admin/services": "Services",
  "/admin/trade-prices": "Trade Prices",
  "/admin/customers": "Customers",
  "/admin/payments": "Payments",
  "/admin/emails": "Emails",
  "/admin/loi": "Letters of Intent",
  "/admin/users": "Users",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Settings",
};

export function AdminTopbar({ email }: { email: string }) {
  const pathname = usePathname();
  const title =
    TITLES[pathname] ??
    Object.entries(TITLES).find(([href]) => href !== "/admin" && pathname.startsWith(href))?.[1] ??
    "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-3 border-b border-border bg-canvas/80 px-4 backdrop-blur-md md:px-10">
      <div className="flex min-w-0 items-center gap-2">
        <AdminMobileNav />
        <h1 className="truncate text-lg font-semibold tracking-tight md:text-xl">{title}</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar>
            <AvatarFallback>{initials(email)}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm text-muted-foreground sm:block">{email}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/admin/settings">
              <User className="h-4 w-4" /> Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              void logout();
            }}
            className="text-destructive"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
