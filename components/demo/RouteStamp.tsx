"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * §8.4's route beat. SENT TO TOAST stamps in, Label style, Basil, rotated
 * -6deg, elastic.out(1, 0.45). elastic is reserved for stamps and chips only
 * (§10.2), and this is a stamp: it should land like something pressed onto
 * paper, not slide in.
 */
export function RouteStamp() {
  const el = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    initGsap();
    const node = el.current;
    if (!node) return;

    if (prefersReducedMotion()) {
      gsap.set(node, { opacity: 1, scale: 1, rotate: -6 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { opacity: 0, scale: 0.72, rotate: -18 },
        {
          opacity: 1,
          scale: 1,
          rotate: -6,
          duration: 0.7,
          ease: "elastic.out(1, 0.45)",
        },
      );
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="routestamp" ref={el}>
      <span className="t-label">Sent to Toast</span>
    </div>
  );
}
