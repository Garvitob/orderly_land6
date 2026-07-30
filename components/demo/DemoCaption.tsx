"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * §6.3, and the brief says explicitly that this is not optional. A caption
 * line directly beneath the phone, Label style, --text-2, cross-fading 180ms.
 *
 * The whole beat list is rendered and height-locked by a sizer holding the
 * longest caption, so the line can never reflow the layout as beats change,
 * and so a reader can never see two captions at once.
 */
export function DemoCaption({
  captions,
  active,
}: {
  captions: readonly string[];
  active: number;
}) {
  const wrap = useRef<HTMLDivElement | null>(null);
  const previous = useRef<number>(-1);

  const longest = captions.reduce((a, b) => (b.length > a.length ? b : a), "");

  useEffect(() => {
    initGsap();
    const el = wrap.current;
    if (!el) return;
    if (previous.current === active) return;

    const lines = el.querySelectorAll<HTMLElement>("[data-cap]");
    if (!lines.length) return;

    const prev = previous.current;
    previous.current = active;

    if (prefersReducedMotion()) {
      gsap.set(lines, { opacity: 0 });
      gsap.set(lines[active], { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      if (prev >= 0 && lines[prev]) {
        gsap.to(lines[prev], { opacity: 0, duration: 0.18, ease: "power1.in" });
      }
      gsap.fromTo(
        lines[active],
        { opacity: 0 },
        { opacity: 1, duration: 0.18, ease: "power2.out", delay: prev >= 0 ? 0.18 : 0 },
      );
    }, el);

    return () => {
      ctx.revert();
    };
  }, [active]);

  return (
    <div className="democap" ref={wrap} aria-live="polite">
      <p className="t-label democap-sizer" aria-hidden="true">
        {longest}
      </p>
      {captions.map((c, i) => (
        <p
          key={c}
          data-cap={i}
          className="t-label democap-line"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          {c}
        </p>
      ))}
    </div>
  );
}
