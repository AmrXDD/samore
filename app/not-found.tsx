import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="container-tight flex h-20 items-center">
        <Logo />
      </header>
      <main className="container-tight flex flex-1 flex-col items-center justify-center py-24 text-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="max-w-lg text-balance text-4xl font-semibold tracking-tighter md:text-5xl">
          This page could not be found.
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Back to home</Link>
        </Button>
      </main>
    </div>
  );
}
