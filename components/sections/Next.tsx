"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { useInView } from "@/lib/useInView";
import { Label } from "@/components/primitives/Label";
import { Phone } from "@/components/demo/Phone";
import { MENU } from "@/lib/menu";

const CHIPS = [
  { label: "Discover", y: -60 },
  { label: "Rewards", y: -38 },
  { label: "Favorites", y: -22 },
] as const;

/* §8.13 asks for "recommended-for-you cards" and they were missing. Read off
   the real menu so no dish or restaurant name is invented (§12). */
const RECOMMENDED = MENU.slice(0, 2);

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
  /* An IntersectionObserver, not a once:true ScrollTrigger. Measured: with a
     trigger these all fired while the section was still far off screen, so the
     count and every reveal had finished before the reader arrived and the
     section read as a static picture. This page has two sticky holds above it,
     so ScrollTrigger's cached start positions are stale often enough that
     once:true cannot be trusted for something the reader has to actually see. */
  const inView = useInView(root);
  /** React runs effects twice in dev; the count must not restart mid-run. */
  const counted = useRef(false);
  const cancelCount = useRef<(() => void) | null>(null);

  useEffect(() => {
    initGsap();
    const rootEl = root.current;
    if (!rootEl || prefersReducedMotion()) return;

    /* The count lives OUTSIDE the gsap context on purpose. ctx.revert() runs on
       every cleanup, and React's dev double-invoke meant the tween was killed
       milliseconds after starting, so the number jumped 0 to 320 with nothing
       in between. The ref guarantees it runs exactly once either way. */
    if (inView && !counted.current) {
      const pts = rootEl.querySelector<HTMLElement>("[data-count-pts]");
      if (pts) {
        counted.current = true;
        /* Driven on its own rAF rather than through GSAP. gsap.ticker on this
           page is pumped by Lenis (SmoothScroll wires lenis.raf into it), so a
           tween of a plain object is at the mercy of that chain; a count is the
           one thing here whose whole point is the frames in between, so it owns
           its clock. power4.out matches §8.7's figures. */
        const DURATION = 1400;
        let start = 0;
        let raf = 0;
        const step = (now: number) => {
          if (!start) start = now;
          const t = Math.min(1, (now - start) / DURATION);
          // power4.out, matching §8.7's figures
          const eased = 1 - Math.pow(1 - t, 4);
          pts.textContent = String(Math.round(eased * 320));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        pts.textContent = "0";
        raf = requestAnimationFrame(step);
        cancelCount.current = () => {
          cancelAnimationFrame(raf);
          // §6.4: the real number must survive a cancelled animation.
          pts.textContent = "320";
        };
      }
    }

    const ctx = gsap.context(() => {
      /* The parallax was the only thing moving here, so the section read as a
         static picture with three drifting chips. Everything now arrives. */

      if (!inView) {
        // Held at the "from" state until the reader is actually here.
        gsap.set(rootEl.querySelectorAll("[data-reward-row]"), { opacity: 0, y: 14 });
        gsap.set(rootEl.querySelectorAll("[data-chip-y]"), { opacity: 0, scale: 0.86 });
        gsap.set(rootEl.querySelectorAll("[data-next-copy] > *"), { opacity: 0, y: 20 });
      } else {
        // The figure counts, the way §8.7's do. Tabular, so nothing reflows.
        // The rewards card fills itself in, top to bottom.
        gsap.to(rootEl.querySelectorAll("[data-reward-row]"), {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "shift",
          stagger: 0.08,
        });

        // The chips land before they start drifting.
        gsap.to(rootEl.querySelectorAll("[data-chip-y]"), {
          opacity: 1,
          scale: 1,
          duration: 0.62,
          ease: "back.out(1.9)",
          stagger: 0.09,
        });

        // The copy lifts in beside it.
        gsap.to(rootEl.querySelectorAll("[data-next-copy] > *"), {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "shift",
          stagger: 0.09,
        });
      }

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
  }, [inView]);

  // Stop the counter if the section leaves before it finishes.
  useEffect(() => () => cancelCount.current?.(), []);

  return (
    <section id="next" ref={root} className="sec next">
      <div className="next-visual">
        <Phone className="next-phone">
          <div className="rewards">
            <div data-reward-row>
              <Label tone="text-2">Your rewards</Label>
            </div>
            <p
              className="t-figure rewards-pts"
              style={{ color: "var(--orange)" }}
              data-reward-row
            >
              <span className="tnum" data-count-pts>
                320
              </span>
            </p>
            <div data-reward-row>
              <Label tone="text-2">points</Label>
            </div>
            <div className="rewards-favs" data-reward-row>
              <Label tone="text-2">Favorites</Label>
              <p className="t-serif">Copper Skillet</p>
              <p className="t-serif">Orange Square</p>
            </div>
            <div className="rewards-rec" data-reward-row>
              <Label tone="text-2">Recommended</Label>
              {RECOMMENDED.map((d) => (
                <p key={d.id} className="rewards-rec-row">
                  <span className="t-serif">{d.name}</span>
                  <span className="rewards-rec-note">{d.note}</span>
                </p>
              ))}
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

      <div className="next-copy" data-next-copy>
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
