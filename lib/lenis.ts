"use client";

import type Lenis from "lenis";

/**
 * SmoothScroll owns the single Lenis instance. This registry exists so other
 * modules can put the scroll position back THROUGH Lenis rather than through
 * window.scrollTo.
 *
 * Why that matters: ScrollTrigger.refresh() measures every pinned trigger by
 * jumping the document to scroll 0 and restoring natively afterwards. Act I is
 * a pin with invalidateOnRefresh, so a refresh anywhere on the page runs that
 * dance. A native restore leaves Lenis's own targetScroll at 0, and Lenis then
 * lerps the page back to the top on the next tick. Restoring through Lenis
 * keeps its internal target and the DOM in agreement.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null): void {
  instance = next;
}

/** Null under prefers-reduced-motion, where Lenis is never constructed. */
export function getLenis(): Lenis | null {
  return instance;
}

/** A native restore can leave Lenis pulling toward a stale target for a frame,
 *  so the position is checked twice. The synchronous check happens with no time
 *  elapsed, where any displacement at all must be the refresh's doing. The
 *  next-frame check has to tolerate a reader who is genuinely still scrolling,
 *  so it only intervenes on a jump far larger than a frame of momentum. */
const EXACT = 1;
const JUMP = 120;

/**
 * Refresh pinned geometry without losing the reader's place. Used by the theme
 * swap (§4.3) and anywhere else layout is invalidated after first paint.
 */
export function refreshPreservingScroll(refresh: () => void): void {
  const y = window.scrollY;
  refresh();

  const restore = (tolerance: number) => {
    if (Math.abs(window.scrollY - y) < tolerance) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(y, { immediate: true, force: true });
    } else {
      window.scrollTo(0, y);
    }
  };

  restore(EXACT);
  requestAnimationFrame(() => restore(JUMP));
}
