import type { ReactNode } from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { ChangePasswordForm } from "@/components/forms/change-password-form";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const profile = await requireAdmin();

  // Force password change on first login (seeded admin).
  if (profile.must_change_password) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <p className="eyebrow mb-3">Security</p>
            <h1 className="text-2xl font-semibold tracking-tighter">Set a new password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              For security, please change the default password before continuing.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-8">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar email={profile.email} />
        <div className="flex-1 px-6 py-8 md:px-10">{children}</div>
      </div>
    </div>
  );
}
