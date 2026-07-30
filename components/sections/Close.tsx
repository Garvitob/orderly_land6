"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { Mark } from "@/components/chrome/Mark";
import { Label } from "@/components/primitives/Label";

const PRODUCT = ["How it works", "For operators", "FAQs", "Docs", "News"] as const;
const LEGAL = [
  "Privacy policy",
  "Terms of service",
  "Delete my data",
  "Contact",
] as const;

/**
 * §8.15 CLOSE. The payoff for the entire scroll.
 *
 * As this section enters, the ticket spine completes and FIRED stamps onto it in
 * Basil with SERVICE COMPLETE beside it. The reader's own scroll placed an
 * order, and this is where they find out.
 *
 * ONE ORANGE ACCENT: the mark. Nothing else.
 */
export function Close() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    initGsap();
    const rootEl = root.current;
    if (!rootEl) return;

    const stamp = rootEl.querySelector<HTMLElement>("[data-service-complete]");
    if (!stamp) return;

    if (prefersReducedMotion()) {
      gsap.set(stamp, { opacity: 1, scale: 1, rotate: -7 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        stamp,
        { opacity: 0, scale: 0.7, rotate: -22 },
        {
          opacity: 1,
          scale: 1,
          rotate: -7,
          duration: 0.8,
          ease: "elastic.out(1, 0.4)",
          scrollTrigger: { trigger: rootEl, start: "top 76%", once: true },
        },
      );
    }, rootEl);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <footer id="close" ref={root} className="close">
      <div className="close-inner">
        <div className="close-brand">
          <Mark size={34} title="Orderly" />
          <span className="close-word">Orderly</span>
        </div>

        <p className="t-headline close-tagline">Keep your restaurant Orderly</p>

        <div className="close-cols">
          <div>
            <Label tone="text-2">Product</Label>
            <ul className="close-list">
              {PRODUCT.map((l) => (
                <li key={l}>
                  <a href="#top">{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Label tone="text-2">Legal</Label>
            <ul className="close-list">
              {LEGAL.map((l) => (
                <li key={l}>
                  <a href="#top">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* The payoff, stated in text as well as in the spine, because
              nothing important may live only inside an animation (§6.4). */}
          <div className="close-stamp">
            <span className="t-label" data-service-complete>
              Service complete
            </span>
          </div>
        </div>

        <div className="close-foot">
          <Label tone="text-2">© 2026 Orderly</Label>
          <Label tone="text-2">brand@orderly.com</Label>
        </div>
      </div>

      {/* Texture, not a second headline: clipped by the bottom edge. */}
      <span className="close-giant" aria-hidden="true">
        Orderly
      </span>
    </footer>
  );
}
