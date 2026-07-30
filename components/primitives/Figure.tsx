import { cn } from "@/lib/cn";
import { Label } from "./Label";

/**
 * A metric. Tabular figures always, so a counting number never reflows its
 * own width (§5.2). The caption is Label style and sits under the number,
 * never beside it, so a row of Figures never reads as a stat-card row.
 *
 * `accent` is the single orange permission and is passed by exactly one
 * Figure per section (§4.2).
 */
export function Figure({
  value,
  caption,
  accent = false,
  valueId,
  className,
  size = "figure",
}: {
  value: string;
  caption?: string;
  accent?: boolean;
  /** Hook for a count-up to target the text node without a query selector. */
  valueId?: string;
  className?: string;
  size?: "figure" | "headline";
}) {
  return (
    <div className={cn("ofig", className)}>
      <p
        className={size === "figure" ? "t-figure" : "t-headline"}
        style={{ color: accent ? "var(--orange)" : "var(--text)" }}
      >
        <span id={valueId} className="tnum">
          {value}
        </span>
      </p>
      {caption ? (
        <Label tone="text-2" className="ofig-cap">
          {caption}
        </Label>
      ) : null}
    </div>
  );
}
