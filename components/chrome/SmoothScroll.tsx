"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { setLenis, refreshPreservingScroll } from "@/lib/lenis";

/**
 * Lenis at lerp 0.09, driven from gsap.ticker so smooth scroll and every
 * ScrollTrigger share one clock (§10.3). Destroyed entirely under
 * prefers-reduced-motion, which hands the page back to native scroll.
 */
export function SmoothScroll() {
  useEffect(() => {
    initGsap();

    /* initGsap takes "resize" out of ScrollTrigger's autoRefreshEvents to stop
       it racing gsap.matchMedia, so this is now the ONLY thing that refreshes
       after a resize and it has to be registered on both paths. A resize can
       land mid-page, and refresh measures pins from scroll 0, so it also has to
       put the reader back where they were. */
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(
        () => refreshPreservingScroll(() => ScrollTrigger.refresh()),
        180,
      );
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    if (prefersReducedMotion()) {
      // No Lenis at all. Native scroll, no pins, no scrubs.
      ScrollTrigger.refresh();
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);
        window.clearTimeout(resizeTimer);
      };
    }

    const lenis = new Lenis({ lerp: 0.09 });
    setLenis(lenis);

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    /* Trigger positions are measured against layout, and layout is not final
       until fonts, the hero video and the first images have settled. A stale
       measurement is what makes a pin hold past its release point, so refresh
       is deliberately belt-and-braces here. */
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    void document.fonts?.ready.then(refresh);

    const settleTimers = [400, 1200, 2400].map((ms) =>
      window.setTimeout(refresh, ms),
    );

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      settleTimers.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(resizeTimer);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
