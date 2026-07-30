"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { Label } from "@/components/primitives/Label";

/** §1.1, verbatim. Do not reword. */
const PAIRS = [
  {
    are: "An intelligent ordering assistant",
    not: "A chatbot in a window",
  },
  {
    are: "A layer on top of existing operations",
    not: "A point of sale or kiosk replacement",
  },
  {
    are: "Premium, warm, and effortless",
    not: "Another ordering app",
  },
  {
    are: "Built for outcomes: revenue, speed, satisfaction",
    not: "Sci fi. No robots, no glowing brains, ever.",
  },
] as const;

/**
 * §8.5 WHAT WE ARE NOT. Answers: is this going to replace my POS or my staff?
 *
 * The operator's biggest unspoken fear, answered by direct contrast. The
 * section physically performs "enhance, never replace": the right column is
 * struck through and dimmed while the left brightens and gets checked.
 *
 * Pin 2 of exactly 3. Each pair owns 0.25 of progress, and the fourth holds for
 * 0.1 before release, because that fourth line is the page telling an operator
 * it will not embarrass them.
 *
 * ONE ORANGE ACCENT: none. This is the only section on the page with no orange
 * at all, which is what makes the orange flood in §8.12 land.
 */
export function WeAreNot() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    initGsap();
    const rootEl = root.current;
    if (!rootEl) return;

    const strikes = rootEl.querySelectorAll<SVGLineElement>("[data-strike]");
    const nots = rootEl.querySelectorAll<HTMLElement>("[data-not]");
    const ares = rootEl.querySelectorAll<HTMLElement>("[data-are]");
    const checks = rootEl.querySelectorAll<SVGPathElement>("[data-check]");

    // §10.4: all four pairs already resolved, no pin, no scrub.
    if (prefersReducedMotion()) {
      gsap.set(strikes, { drawSVG: "100%" });
      gsap.set(nots, { opacity: 0.4 });
      gsap.set(ares, { opacity: 1, yPercent: 0 });
      gsap.set(checks, { drawSVG: "100%" });
      return;
    }

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      gsap.set(strikes, { drawSVG: "0%" });
      gsap.set(checks, { drawSVG: "0%" });
      gsap.set(ares, { opacity: 0.16, yPercent: 40 });

      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          immediateRender: false,
          scrollTrigger: {
            trigger: rootEl,
            start: "top top",
            end: "+=120%",
            pin: true,
            anticipatePin: 1,
            scrub: true,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "none" },
        });

        PAIRS.forEach((_, i) => {
          // 0.225 of progress per pair leaves 0.1 of hold on the fourth.
          const at = i * 0.225;

          // 1. the rule draws through the WE ARE NOT item, left to right
          tl.to(strikes[i], { drawSVG: "100%", duration: 0.09 }, at);
          // 2. and it drops to 40%
          tl.to(nots[i], { opacity: 0.4, duration: 0.09 }, at);
          // 3. simultaneously the WE ARE item masks up into full Oat
          tl.to(
            ares[i],
            { opacity: 1, yPercent: 0, duration: 0.11, ease: "power2.out" },
            at,
          );
          // 4. and a small Basil check draws beside it
          tl.to(checks[i], { drawSVG: "100%", duration: 0.06 }, at + 0.04);
        });

        // Hold on the fourth pair before releasing.
        tl.to({}, { duration: 0.1 });
      });

      // Mobile: no pin. Each pair resolves on its own onEnter (§8.5).
      mm.add("(max-width: 1023px)", () => {
        PAIRS.forEach((_, i) => {
          const row = rootEl.querySelectorAll<HTMLElement>("[data-pair]")[i];
          if (!row) return;
          const tl = gsap.timeline({
            immediateRender: false,
            scrollTrigger: { trigger: row, start: "top 78%", once: true },
          });
          tl.to(strikes[i], { drawSVG: "100%", duration: 0.32, ease: "none" }, 0)
            .to(nots[i], { opacity: 0.4, duration: 0.32, ease: "none" }, 0)
            .to(
              ares[i],
              { opacity: 1, yPercent: 0, duration: 0.22, ease: "shift" },
              0,
            )
            .to(checks[i], { drawSVG: "100%", duration: 0.22, ease: "none" }, 0.1);
        });
      });
    }, rootEl);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section id="wearenot" ref={root} className="wearenot">
      <div className="wearenot-inner">
        <Label tone="text-2">Where Orderly sits</Label>
        <h2 className="t-headline sec-head wearenot-head">
          Orderly works with what you already run.
        </h2>
        <p className="t-body sec-sub wearenot-sub">
          It sits on top of your operation. It does not replace your point of
          sale, your kiosks, or your people.
        </p>

        <div className="wearenot-cols">
          <div className="wearenot-col">
            <Label tone="text-2">We are</Label>
            <ul className="wearenot-list">
              {PAIRS.map((p) => (
                <li key={p.are} className="wearenot-item is-are">
                  <svg
                    className="wearenot-check"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      data-check
                      d="M2.5 8.6 L6.2 12.2 L13.5 4.2"
                      fill="none"
                      stroke="var(--basil)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="wearenot-mask">
                    <span data-are className="wearenot-text">
                      {p.are}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="wearenot-col">
            <Label tone="text-2">We are not</Label>
            <ul className="wearenot-list">
              {PAIRS.map((p) => (
                <li key={p.not} className="wearenot-item is-not" data-pair>
                  <span className="wearenot-strikewrap">
                    <span data-not className="wearenot-text is-dim">
                      {p.not}
                    </span>
                    <svg
                      className="wearenot-strike"
                      viewBox="0 0 100 1"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <line
                        data-strike
                        x1="0"
                        y1="0.5"
                        x2="100"
                        y2="0.5"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </svg>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
