"use client";

/**
 * §6.3, and the brief says explicitly that this is not optional. A caption line
 * directly beneath the phone, Label style, --text-2, cross-fading 180ms.
 *
 * Deliberately CSS, not GSAP. This is the interaction layer (§10.1): 180ms,
 * ease-out, interruptible, and it belongs off the main thread.
 *
 * It was GSAP first and that was a bug: `ctx.revert()` on each beat change
 * restored the *previous* fade-out to its pre-tween value, so retired captions
 * popped back to full opacity and three lines stacked at once. A transition has
 * no history to revert.
 *
 * The 180ms is spent as a hand-off, not a dissolve: 90ms out, then 90ms in via
 * transition-delay, so two captions are never legible at the same time.
 *
 * Height is locked by a sizer carrying the longest caption, so the line can
 * never reflow the layout as beats change.
 */
export function DemoCaption({
  captions,
  active,
}: {
  captions: readonly string[];
  active: number;
}) {
  const longest = captions.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <div className="democap" aria-live="polite">
      <p className="t-label democap-sizer" aria-hidden="true">
        {longest}
      </p>
      {captions.map((c, i) => (
        <p
          key={c}
          className="t-label democap-line"
          data-on={i === active ? "true" : "false"}
          aria-hidden={i === active ? undefined : true}
        >
          {c}
        </p>
      ))}
    </div>
  );
}
