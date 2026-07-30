"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { Label } from "@/components/primitives/Label";
import { Phone } from "@/components/demo/Phone";

const CHIPS = [
  { label: "Discover", y: -60 },
  { label: "Rewards", y: -38 },
  { label: "Favorites", y: -22 },
] as const;

/**
 * §8.13 WHAT'S NEXT.
 *
 * FLAGGED DEVIATION: the client's original line used "unlock", which §5.3 bans.
 * Rewritten to "earn". The rest of the sentence is theirs.
 *
 * ONE ORANGE ACCENT: the 320 figure.
 */
export function Next() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    initGsap();
    const rootEl = root.current;
    if (!rootEl || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      rootEl.querySelectorAll<HTMLElement>("[data-chip-y]").forEach((chip) => {
        const y = Number(chip.dataset.chipY ?? 0);
        gsap.fromTo(
          chip,
          { y: 0 },
          {
            y,
            ease: "none",
            scrollTrigger: {
              trigger: rootEl,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, rootEl);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section id="next" ref={root} className="sec next">
      <div className="next-visual">
        <Phone className="next-phone">
          <div className="rewards">
            <Label tone="text-2">Your rewards</Label>
            <p className="t-figure rewards-pts" style={{ color: "var(--orange)" }}>
              <span className="tnum">320</span>
            </p>
            <Label tone="text-2">points</Label>
            <div className="rewards-favs">
              <Label tone="text-2">Favorites</Label>
              <p className="t-serif">Copper Skillet</p>
              <p className="t-serif">Orange Square</p>
            </div>
          </div>
        </Phone>

        {CHIPS.map((c) => (
          <span
            key={c.label}
            className="next-chip t-label"
            data-chip-y={c.y}
          >
            {c.label}
          </span>
        ))}
      </div>

      <div className="next-copy">
        <Label tone="text-2">Guest platform. Coming soon</Label>
        <h2 className="t-headline sec-head">
          From one great meal to the next favorite table.
        </h2>
        <p className="t-body sec-sub">
          Orderly will turn every dine-in moment into a reason to return. Guests
          can save favorites, discover new restaurants, and earn rewards through
          the ordering experience they already love.
        </p>
      </div>
    </section>
  );
}
