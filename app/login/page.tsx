import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "SAMORE administrator sign in.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="container-tight flex h-20 items-center">
        <Logo />
      </header>

      <main className="container-tight flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <p className="eyebrow mb-3">Administrator</p>
            <h1 className="text-3xl font-semibold tracking-tighter">Sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Access the SAMORE admin dashboard.
            </p>
          </div>

          {error === "forbidden" ? (
            <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-center text-sm text-destructive">
              This account is not authorized for the admin panel.
            </div>
          ) : null}

          <div className="rounded-lg border border-border bg-card p-8">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link href="/" className="underline underline-offset-4 hover:text-foreground">
              Return to website
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
