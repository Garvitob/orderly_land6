import { cn } from "@/lib/cn";
import type { Tone } from "@/lib/types";

const TONE: Record<Tone, string> = {
  text: "var(--text)",
  "text-2": "var(--text-2)",
  orange: "var(--orange)",
  ink: "var(--ink)",
  oat: "var(--oat)",
  basil: "var(--basil)",
};

/**
 * Label style (§4.4): Hanken 600, 12px, +0.14em, uppercase, tabular figures.
 * This is what stands in for a monospace face across the whole page. Clocks,
 * ticket lines, pips, form captions and data all use it.
 */
export function Label({
  children,
  tone = "text-2",
  as: As = "p",
  className,
  style,
}: {
  children: React.ReactNode;
  tone?: Tone;
  as?: "p" | "span" | "div" | "dt" | "h2" | "h3";
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <As
      className={cn("t-label", className)}
      style={{ color: TONE[tone], ...style }}
    >
      {children}
    </As>
  );
}
