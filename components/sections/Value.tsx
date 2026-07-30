"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { Label } from "@/components/primitives/Label";
import { money } from "@/lib/menu";

const FRAGMENTS = [
  "no onions",
  "is this gluten free?",
  "what do you recommend?",
] as const;

/**
 * §8.10 EVERY ORDER DRIVES VALUE. Answers: what is in it for me, my staff, my
 * guests?
 *
 * NOT a card row. Three full-width horizontal bands on --surface-2 stacked at
 * zero gap so they read as one object divided by hairlines (§5.2). Label left,
 * Headline centre, a live detail right.
 *
 * Each band slides in from alternating sides, preceded by a hairline drawing
 * across its full width. Grid returns to 12 columns here, per §8.10, which is
 * the ruling that overrode §5.2's looser summary.
 *
 * ONE ORANGE ACCENT: the ticket average figure in band one.
 */
export function Value() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    initGsap();
    const rootEl = root.current;
    if (!rootEl) return;

    const bands = rootEl.querySelectorAll<HTMLElement>("[data-band]");
    const rules = rootEl.querySelectorAll<SVGLineElement>("[data-bandrule]");
    const avg = rootEl.querySelector<HTMLElement>("[data-avg]");
    const dots = rootEl.querySelectorAll<HTMLElement>("[data-dot]");
    const frags = rootEl.querySelectorAll<HTMLElement>("[data-frag]");

    if (prefersReducedMotion()) {
      gsap.set(bands, { opacity: 1, x: 0 });
      gsap.set(rules, { drawSVG: "100%" });
      gsap.set(dots, { opacity: 1 });
      gsap.set(frags[0], { opacity: 1 });
      if (avg) avg.textContent = money(32.45);
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(rules, { drawSVG: "0%" });

      bands.forEach((band, i) => {
        const from = i % 2 === 0 ? -40 : 40;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: band, start: "top 82%", once: true },
        });
        tl.to(rules[i], { drawSVG: "100%", duration: 0.6, ease: "shift" }, 0).fromTo(
          band,
          { opacity: 0, x: from },
          { opacity: 1, x: 0, duration: 0.85, ease: "shift" },
          0.12,
        );
      });

      // band 1: the ticket average ticks up
      if (avg) {
        const a = { v: 28.95 };
        gsap.to(a, {
          v: 32.45,
          duration: 1.1,
          ease: "power3.out",
          onUpdate: () => {
            avg.textContent = money(a.v);
          },
          scrollTrigger: { trigger: bands[0], start: "top 74%", once: true },
        });
      }

      // band 2: table dots go from needing attention to handled, one at a time
      gsap.to(dots, {
        opacity: 1,
        duration: 0.3,
        stagger: 0.14,
        ease: "none",
        scrollTrigger: { trigger: bands[1], start: "top 78%", once: true },
      });
      dots.forEach((dot, i) => {
        gsap.to(dot, {
          backgroundColor: "var(--basil)",
          duration: 0.01,
          delay: 0.7 + i * 0.42,
          scrollTrigger: { trigger: bands[1], start: "top 78%", once: true },
        });
      });

      // band 3: three guest fragments cross-fade, hand-off not dissolve
      const tlF = gsap.timeline({
        repeat: -1,
        scrollTrigger: { trigger: bands[2], start: "top 82%" },
      });
      frags.forEach((f, i) => {
        const next = frags[(i + 1) % frags.length];
        tlF
          .to(f, { opacity: 0, duration: 0.22, ease: "power1.in" }, i * 2.6 + 2.2)
          .fromTo(
            next,
            { opacity: 0 },
            { opacity: 1, duration: 0.28, ease: "power2.out", immediateRender: false },
            i * 2.6 + 2.42,
          );
      });
    }, rootEl);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section id="value" ref={root} className="sec value">
      <Label tone="text-2">Who feels it</Label>
      <h2 className="t-headline sec-head">Every order now drives value.</h2>
      <p className="t-body sec-sub">
        AI turns each conversation into a cleaner ticket, a more relevant
        recommendation, and a better experience for everyone at the table.
      </p>

      <div className="bands">
        {/* stacked at zero gap: one object divided by hairlines */}
        <div className="band" data-band>
          <svg
            className="band-rule"
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              data-bandrule
              x1="0"
              y1="0.5"
              x2="100"
              y2="0.5"
              stroke="var(--rule)"
              strokeWidth="1"
            />
          </svg>
          <Label tone="text-2">For operators</Label>
          <h3 className="t-headline band-head">
            Stop bleeding money at the table.
          </h3>
          {/* div, not p: Label renders a <p> and a nested <p> is invalid HTML,
              which React reports as a hydration failure. */}
          <div className="band-detail">
            <span
              data-avg
              className="t-figure band-fig tnum"
              style={{ color: "var(--orange)" }}
            >
              {money(28.95)}
            </span>
            <Label tone="text-2">average ticket</Label>
          </div>
        </div>

        <div className="band" data-band>
          <svg
            className="band-rule"
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              data-bandrule
              x1="0"
              y1="0.5"
              x2="100"
              y2="0.5"
              stroke="var(--rule)"
              strokeWidth="1"
            />
          </svg>
          <Label tone="text-2">For staff</Label>
          <h3 className="t-headline band-head">Make room for real hospitality.</h3>
          <div className="band-detail floorplan">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                data-dot
                className="floor-dot"
                style={{ background: "var(--orange)", opacity: 0 }}
              />
            ))}
            <Label tone="text-2">tables handled</Label>
          </div>
        </div>

        <div className="band" data-band>
          <svg
            className="band-rule"
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              data-bandrule
              x1="0"
              y1="0.5"
              x2="100"
              y2="0.5"
              stroke="var(--rule)"
              strokeWidth="1"
            />
          </svg>
          <Label tone="text-2">For guests</Label>
          <h3 className="t-headline band-head">
            Order instantly, exactly how they want.
          </h3>
          <div className="band-detail fragstack">
            {FRAGMENTS.map((f, i) => (
              <span
                key={f}
                data-frag
                className="t-serif frag"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                &ldquo;{f}&rdquo;
              </span>
            ))}
            <span className="t-serif frag frag-sizer" aria-hidden="true">
              &ldquo;{FRAGMENTS[2]}&rdquo;
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
