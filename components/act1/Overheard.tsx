"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { COPY } from "@/lib/copy";
import { Label } from "@/components/primitives/Label";

/**
 * §8.2's overheard lines. You are looking down into a room full of people
 * ordering, so you hear them. Instrument Serif italic, because these are
 * people speaking, not the interface talking.
 *
 * The container height is set by an invisible sizer carrying the longest line
 * in normal flow, with every real line absolutely positioned on top. That is
 * how the block never reflows as lines swap, with no measurement in JS.
 *
 * Under reduced motion, line one shows and nothing rotates (§10.4).
 */
const LONGEST = COPY.overheard.reduce((a, b) => (b.length > a.length ? b : a));

export function Overheard() {
  const wrap = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    initGsap();
    const el = wrap.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const lines = el.querySelectorAll<HTMLElement>("[data-line]");
    if (lines.length < 2) return;

    const HOLD = 3.4;
    const FADE = 0.52;

    const ctx = gsap.context(() => {
      // Own the initial state here rather than leaning on React's inline
      // style. StrictMode double-invokes this effect in development, and
      // ctx.revert() between invocations clears the inline opacity, which
      // left an arbitrary line showing at load.
      gsap.set(lines, { opacity: 0, y: 0 });
      gsap.set(lines[0], { opacity: 1 });

      const tl = gsap.timeline({ repeat: -1 });

      lines.forEach((line, i) => {
        const out = i * HOLD + (HOLD - FADE);
        const next = lines[(i + 1) % lines.length];

        // A pure cross-fade at one position turns two sentences into mush for
        // the whole 520ms overlap. Watched it, it was illegible. The overlap
        // stays at the specified 520ms; the outgoing line lifts 8px and the
        // incoming rises 8px so the two states are spatially separable while
        // they cross. Transform and opacity only.
        tl.to(line, { opacity: 0, y: -8, duration: FADE, ease: "none" }, out);
        tl.fromTo(
          next,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: FADE,
            ease: "none",
            // fromTo defaults to immediateRender:true, which fires every
            // from-state at creation and leaves the wrong line showing at
            // load. The timeline must honour its own positions.
            immediateRender: false,
          },
          out,
        );
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="overheard">
      <Label tone="text-2">{COPY.act1.overheardLabel}</Label>
      <div className="overheard-stack" ref={wrap}>
        {/* Sizer: in flow, invisible, holds the tallest possible line. */}
        <p className="t-overheard overheard-sizer" aria-hidden="true">
          &ldquo;{LONGEST}&rdquo;
        </p>
        {COPY.overheard.map((line, i) => (
          <p
            key={line}
            data-line={i}
            className="t-overheard overheard-line pull-optical"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            &ldquo;{line}&rdquo;
          </p>
        ))}
      </div>
    </div>
  );
}
