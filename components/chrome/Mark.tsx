import { MARK_PATH, MARK_VIEWBOX } from "@/lib/mark";

/**
 * The Orderly mark. One colour, inherited via currentColor, so the same asset
 * is orange on light and white on orange or ink exactly as the kit's Logo page
 * requires. Never stretched, squashed, recoloured, rotated, or given an effect.
 * Minimum 24px.
 *
 * When `drawable`, the path also carries a stroke so §4.6's single permitted
 * animation (a DrawSVG stroke reveal in Act I, once per session) can run: the
 * outline draws, then the fill inks in. After that it is static forever.
 */
export function Mark({
  size = 32,
  drawable = false,
  pathRef,
  title,
  className,
}: {
  size?: number;
  drawable?: boolean;
  pathRef?: (el: SVGPathElement | null) => void;
  /** Omit when a visible "Orderly" wordmark sits beside it. */
  title?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ flex: "0 0 auto", overflow: "visible" }}
    >
      <path
        ref={pathRef}
        d={MARK_PATH}
        fill="currentColor"
        fillRule="evenodd"
        stroke={drawable ? "currentColor" : undefined}
        strokeWidth={drawable ? 3 : undefined}
        strokeLinejoin={drawable ? "round" : undefined}
      />
    </svg>
  );
}
