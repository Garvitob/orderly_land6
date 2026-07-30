"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

/**
 * Registers every GSAP plugin this page uses, exactly once, and creates the
 * narrative ease. Safe to call from any client component.
 *
 * 'shift' is cubic-bezier(0.22, 1, 0.36, 1) expressed as a CustomEase path.
 * It is the only easing used by the narrative layer (§10.2). The interaction
 * layer uses the CSS ease tokens in globals.css instead (§10.1).
 */
export function initGsap(): void {
  if (registered || typeof window === "undefined") return;

  gsap.registerPlugin(
    ScrollTrigger,
    ScrollToPlugin,
    MotionPathPlugin,
    DrawSVGPlugin,
    SplitText,
    CustomEase,
  );

  if (!CustomEase.get("shift")) {
    CustomEase.create("shift", "M0,0 C0.22,1 0.36,1 1,1");
  }

  // Never let GSAP silently drop frames into a time jump during a scrub.
  gsap.ticker.lagSmoothing(0);

  registered = true;
}

export const NARRATIVE = {
  ease: "shift",
  reveal: 0.85,
  display: 1.1,
  stagger: 0.07,
} as const;

export { gsap, ScrollTrigger, MotionPathPlugin, DrawSVGPlugin, SplitText, CustomEase };
