import Link from "next/link";
import { cn } from "@/lib/utils";

/** SAMORE wordmark — pure typographic, luxury-minimal. */
export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="SAMORE — home"
      className={cn(
        "inline-flex items-center text-lg font-semibold tracking-[0.32em] text-ink transition-opacity hover:opacity-70",
        className,
      )}
    >
      SAMORE
    </Link>
  );
}
