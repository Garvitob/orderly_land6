"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { Label } from "@/components/primitives/Label";

const VERIFIED = [
  "130+ clients",
  "98% order accuracy",
  "Under 300ms response",
  "0 dropped orders",
] as const;

/**
 * §8.7 THE NUMBERS. Answers: does it make me money?
 *
 * Asymmetric on purpose: +23% large and left, the other two stacked right. An
 * even three-column row is §5.1's identical-heights grid and it makes the best
 * number the weakest.
 *
 * The `0` DOES NOT COUNT. It snaps in from scale 1.4 in 120ms, because a
 * counter that ticks from 0 to 0 is a dead animation. That is the joke.
 *
 * The headline is the brand kit's own sanctioned SAY line from its Voice page,
 * not an invention: the brief left this section without one.
 *
 * ONE ORANGE ACCENT: the +23% figure only.
 */
export function Numbers() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    initGsap();
    const rootEl = root.current;
    if (!rootEl) return;

    const pct = rootEl.querySelector<HTMLElement>("[data-count-pct]");
    const mult = rootEl.querySelector<HTMLElement>("[data-count-mult]");
    const zero = rootEl.querySelector<HTMLElement>("[data-zero]");
    if (!pct || !mult || !zero) return;

    if (prefersReducedMotion()) {
      pct.textContent = "+23%";
      mult.textContent = "2.4x";
      gsap.set(zero, { scale: 1, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        immediateRender: false,
        scrollTrigger: { trigger: rootEl, start: "top 72%", once: true },
      });

      const a = { v: 0 };
      tl.to(
        a,
        {
          v: 23,
          duration: 1.4,
          ease: "power4.out",
          onUpdate: () => {
            pct.textContent = `+${Math.round(a.v)}%`;
          },
        },
        0,
      );

      const b = { v: 0 };
      tl.to(
        b,
        {
          v: 2.4,
          duration: 1.4,
          ease: "power4.out",
          onUpdate: () => {
            mult.textContent = `${b.v.toFixed(1)}x`;
          },
        },
        0.12,
      );

      // The joke: it refuses to count.
      tl.fromTo(
        zero,
        { scale: 1.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.12, ease: "power2.out" },
        0.62,
      );

      tl.from(
        rootEl.querySelectorAll("[data-verified] li"),
        { opacity: 0, y: 8, duration: 0.5, ease: "shift", stagger: 0.06 },
        0.8,
      );
    }, rootEl);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section id="numbers" ref={root} className="sec numbers">
      <Label tone="text-2">The numbers</Label>
      <h2 className="t-headline sec-head numbers-head">
        Guests order 23% more when they can ask questions.
      </h2>

      <div className="numbers-grid">
        <div className="numbers-lead">
          <p className="t-figure numbers-big" style={{ color: "var(--orange)" }}>
            <span data-count-pct className="tnum">
              +0%
            </span>
          </p>
          <Label tone="text-2" className="numbers-cap">
            average order value with conversational ordering
          </Label>
        </div>

        <div className="numbers-stack">
          <div>
            <p className="t-figure numbers-small">
              <span data-count-mult className="tnum">
                0.0x
              </span>
            </p>
            <Label tone="text-2" className="numbers-cap">
              faster than a counter
            </Label>
          </div>
          <div>
            <p className="t-figure numbers-small">
              <span data-zero className="tnum">
                0
              </span>
            </p>
            <Label tone="text-2" className="numbers-cap">
              apps to download
            </Label>
          </div>
        </div>
      </div>

      <ul className="verified" data-verified>
        {VERIFIED.map((v) => (
          <li key={v}>
            <Label tone="text-2">{v}</Label>
          </li>
        ))}
      </ul>
    </section>
  );
}
