import { cn } from "@/lib/cn";

type PipTone = "text-2" | "orange" | "basil";

/**
 * A 6px dot. Status, table state, list markers. No glow, ever: the brand kit
 * says "no glowing anything", so state is carried by colour alone.
 */
export function Pip({
  tone = "text-2",
  className,
  size = 6,
}: {
  tone?: PipTone;
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={cn("pip", className)}
      style={{
        width: size,
        height: size,
        background:
          tone === "orange"
            ? "var(--orange)"
            : tone === "basil"
              ? "var(--basil)"
              : "var(--text-2)",
      }}
      aria-hidden="true"
    />
  );
}
