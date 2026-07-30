"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { money } from "@/lib/menu";
import { Label } from "@/components/primitives/Label";

export type PayState = "hidden" | "open" | "paid";

/**
 * §8.4's pay beat. The sheet rises from the screen bottom via translateY, and
 * the confirmation is a Basil checkmark DRAWN with DrawSVG rather than faded
 * in, so payment reads as something that completed rather than something that
 * appeared. Basil is success-only, per §4.1.
 */
export function PaySheet({ state, total }: { state: PayState; total: number }) {
  const sheet = useRef<HTMLDivElement | null>(null);
  const check = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    initGsap();
    const el = sheet.current;
    const tick = check.current;
    if (!el || !tick) return;

    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (state === "hidden") {
        gsap.to(el, {
          yPercent: 100,
          duration: reduced ? 0 : 0.24,
          ease: "power2.in",
        });
        return;
      }

      gsap.to(el, {
        yPercent: 0,
        duration: reduced ? 0 : 0.28,
        ease: "power3.out",
      });

      if (state === "paid") {
        gsap.fromTo(
          tick,
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: reduced ? 0 : 0.32, ease: "power2.out" },
        );
      } else {
        gsap.set(tick, { drawSVG: "0%" });
      }
    });

    return () => {
      ctx.revert();
    };
  }, [state]);

  return (
    <div className="paysheet" ref={sheet} aria-hidden={state === "hidden"}>
      {state === "paid" ? (
        <div className="paysheet-done">
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path
              ref={check}
              d="M4 12.8 L9.4 18 L20 6.6"
              fill="none"
              stroke="var(--basil)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Label tone="basil">Paid</Label>
        </div>
      ) : (
        <>
          <Label tone="text-2">Pay with card on file</Label>
          <span className="paysheet-btn">Pay {money(total)}</span>
        </>
      )}
    </div>
  );
}
