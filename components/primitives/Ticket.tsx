import { cn } from "@/lib/cn";

/**
 * Receipt paper. Used by the spine (§7) and by the printed ticket at §8.9's
 * node 4. Radius is 0: tickets are guillotined, not rounded (§4.5).
 *
 * Perforations are radial-gradient notches painted in the page colour, so the
 * paper genuinely reads as torn from a roll rather than as a bordered box.
 * `axis="y"` notches the top and bottom edges (a printed ticket); `axis="x"`
 * notches the left and right (the vertical spine strip).
 */
export function Ticket({
  children,
  axis = "y",
  shadow = false,
  className,
  style,
}: {
  children?: React.ReactNode;
  axis?: "x" | "y";
  /** One of §4.5's three sanctioned shadow exceptions. Off by default. */
  shadow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        "ticket",
        axis === "y" ? "ticket--perf-y" : "ticket--perf-x",
        shadow && "ticket--shadow",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
