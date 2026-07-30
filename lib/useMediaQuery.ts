"use client";

import { useSyncExternalStore } from "react";

/**
 * matchMedia read that is safe across hydration. The server cannot know the
 * viewport, so it reports `false` and the client corrects on hydration, which
 * keeps first render byte-identical (§14.1).
 *
 * `serverValue` exists for the mobile-video case: §3.2 requires hero-mobile
 * under 900px, and defaulting that to false means desktop sources are what the
 * server emits.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** §11's desktop threshold. Pins and scrubs only exist above this. */
export const DESKTOP = "(min-width: 1024px)";
/** §3.2's video switch point. */
export const NARROW = "(max-width: 899px)";
