"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * STEP 2 SMOKE TEST. Temporary, deleted at step 4.
 *
 * Proves the exact mechanism §8.9 depends on: MotionPathPlugin driving a
 * element along an SVG path with autoRotate, scrubbed by ScrollTrigger, with
 * DrawSVG revealing the path itself. If this judders here it will judder at
 * step 15, so it is worth failing early.
 *
 * The path deliberately uses few control points, which is the brief's own
 * prescribed fix for judder.
 */
export function MotionPathSmoke() {
  const wrap = useRef<HTMLDivElement | null>(null);
  const path = useRef<SVGPathElement | null>(null);
  const dot = useRef<SVGGElement | null>(null);

  useEffect(() => {
    initGsap();

    const wrapEl = wrap.current;
    const pathEl = path.current;
    const dotEl = dot.current;
    if (!wrapEl || !pathEl || !dotEl) return;

    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced) {
        // Static end state: path drawn, receipt parked at the last node.
        gsap.set(pathEl, { drawSVG: "100%" });
        gsap.set(dotEl, { xPercent: -50, yPercent: -50 });
        gsap.set(dotEl, {
          motionPath: {
            path: pathEl,
            align: pathEl,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: 1,
            end: 1,
          },
        });
        return;
      }

      gsap.fromTo(
        pathEl,
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: wrapEl,
            start: "top 80%",
            end: "bottom 60%",
            scrub: true,
          },
        },
      );

      gsap.to(dotEl, {
        motionPath: {
          path: pathEl,
          align: pathEl,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
        ease: "none",
        scrollTrigger: {
          trigger: wrapEl,
          start: "top 80%",
          end: "bottom 60%",
          scrub: true,
        },
      });
    }, wrapEl);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={wrap} style={{ paddingBlock: "var(--sp-tight)" }}>
      <p className="t-label" style={{ color: "var(--text-2)" }}>
        Step 2 · motion path smoke test
      </p>
      <div style={{ height: 16 }} />
      <svg
        viewBox="0 0 600 360"
        style={{ width: "100%", height: "auto", overflow: "visible" }}
        aria-hidden="true"
      >
        <path
          ref={path}
          d="M40,40 L440,40 Q500,40 500,100 L500,180 Q500,240 440,240 L120,240 Q60,240 60,300 L60,320"
          fill="none"
          stroke="var(--rule)"
          strokeWidth="1"
        />
        <g ref={dot}>
          {/* a receipt, not a ball. even the smoke test should be the subject. */}
          <rect
            x="-9"
            y="-13"
            width="18"
            height="26"
            fill="var(--surface-2)"
            stroke="var(--text)"
            strokeWidth="1"
          />
          <path d="M-5,-6 H5 M-5,-1 H5 M-5,4 H2" stroke="var(--text-2)" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}
