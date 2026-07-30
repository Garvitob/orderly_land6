import { cn } from "@/lib/cn";

/** A static hairline from --rule. Never border-gray-200 (§5.2). */
export function Rule({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <hr className={cn("rule", className)} style={style} aria-hidden="true" />;
}

/**
 * A hairline as an SVG line so DrawSVG can draw it across (§8.10's bands each
 * open with a rule drawing full width, §8.5's strike-through). A div hairline
 * cannot be stroke-revealed, so anything animated has to be a real path.
 */
export function RuleDraw({
  className,
  refCallback,
  vertical = false,
}: {
  className?: string;
  refCallback?: (el: SVGLineElement | null) => void;
  vertical?: boolean;
}) {
  return (
    <svg
      className={cn("ruledraw", className)}
      viewBox={vertical ? "0 0 1 100" : "0 0 100 1"}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={vertical ? { width: 1, height: "100%" } : { width: "100%", height: 1 }}
    >
      <line
        ref={refCallback}
        x1="0"
        y1="0"
        x2={vertical ? "0" : "100"}
        y2={vertical ? "100" : "0"}
        stroke="var(--rule)"
        strokeWidth="1"
      />
    </svg>
  );
}
