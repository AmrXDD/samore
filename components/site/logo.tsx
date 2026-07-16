import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * SAMORE logo — the official mark taken from the company's trade documents,
 * paired with the wordmark.
 */
export function Logo({
  className,
  href = "/",
  showWordmark = true,
  size = 34,
}: {
  className?: string;
  href?: string;
  showWordmark?: boolean;
  size?: number;
}) {
  const content = (
    <>
      <Image
        src="/samore-logo.png"
        alt="SAMORE"
        width={size}
        height={Math.round((size * 242) / 236)}
        priority
        className="h-auto w-auto"
        style={{ width: size, height: "auto" }}
      />
      {showWordmark ? (
        <span className="text-lg font-semibold tracking-[0.32em] text-ink">SAMORE</span>
      ) : null}
    </>
  );

  if (!href) {
    return <span className={cn("inline-flex items-center gap-2.5", className)}>{content}</span>;
  }

  return (
    <Link
      href={href}
      aria-label="SAMORE — home"
      className={cn(
        "inline-flex items-center gap-2.5 transition-opacity hover:opacity-70",
        className,
      )}
    >
      {content}
    </Link>
  );
}
