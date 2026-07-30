"use client";

import { useEffect, useState } from "react";

/**
 * Fires once when the element first enters the viewport, and stays true.
 * setState happens inside the observer callback, not in the effect body, so it
 * is a genuine external-event subscription rather than a cascading render.
 */
export function useInView(
  ref: React.RefObject<Element | null>,
  rootMargin = "-15% 0px -15% 0px",
): boolean {
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, seen]);

  return seen;
}
