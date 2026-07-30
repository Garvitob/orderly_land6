"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap, ScrollTrigger, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { useMediaQuery } from "@/lib/useMediaQuery";

const KEY = "orderly-pill-dismissed";
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/**
 * §8.16. A floating pill, bottom centre, appearing after Act I ends. Ink pill,
 * Oat text, one small orange dot.
 *
 * Magnetic on hover, desktop only, gated behind (hover: hover) and
 * (pointer: fine) per §10.3. Clicking scrolls to §8.4 with an offsetY equal to
 * the nav height. Dismissal persists in sessionStorage.
 */
/* Dismissal lives in sessionStorage, and React subscribes to it rather than
   copying it into state inside an effect. The server snapshot is "not
   dismissed", so first render matches the HTML and there is no cascading
   setState for the compiler to flag. */
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function readDismissed(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
function markDismissed() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // private mode. it simply returns next load.
  }
  listeners.forEach((l) => l());
}

export function TryLivePill() {
  const el = useRef<HTMLDivElement | null>(null);
  const dismissed = useSyncExternalStore(subscribe, readDismissed, () => false);
  const [hidden, setHidden] = useState(false);
  const gone = dismissed || hidden;
  const finePointer = useMediaQuery(FINE_POINTER);

  useEffect(() => {
    initGsap();
    const node = el.current;
    if (!node || gone) return;

    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduced ? 0 : 0.42,
          ease: "shift",
          scrollTrigger: {
            trigger: ".act3",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );

      /* §8.16 fixes this bottom centre, so it passes over content as the page
         scrolls, which is what a floating CTA does. It must not do it to the
         demo form: the pill exists to drive someone to that form, and once the
         form is on screen it is both redundant and sitting on top of the
         fields. It comes back if they scroll away without submitting. */
      const lastCall = document.querySelector("#lastcall");
      if (lastCall) {
        gsap.to(node, {
          autoAlpha: 0,
          y: 26,
          duration: reduced ? 0 : 0.2,
          ease: "power2.in",
          scrollTrigger: {
            trigger: lastCall,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      }
    });

    return () => {
      ctx.revert();
    };
  }, [gone]);

  // Magnetic: the pill leans toward the cursor. Decorative, so it is spring-ish
  // and fine-pointer only.
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!finePointer) return;
    const node = el.current;
    if (!node) return;
    const r = node.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    gsap.to(node, {
      x: dx * 0.16,
      y: dy * 0.22,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const onLeave = () => {
    const node = el.current;
    if (!node) return;
    gsap.to(node, { x: 0, y: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" });
  };

  const goToDemo = () => {
    const nav = document.querySelector<HTMLElement>(".onav");
    const offsetY = nav ? nav.offsetHeight + 12 : 80;
    gsap.to(window, {
      duration: prefersReducedMotion() ? 0 : 0.9,
      ease: "shift",
      scrollTo: { y: "#guest", offsetY },
    });
  };

  const dismiss = () => {
    const node = el.current;
    if (node) {
      gsap.to(node, {
        y: 26,
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          markDismissed();
          setHidden(true);
          ScrollTrigger.refresh();
        },
      });
    } else {
      markDismissed();
      setHidden(true);
    }
  };

  if (gone) return null;

  return (
    <div
      ref={el}
      className="pill"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ opacity: 0 }}
    >
      <span className="pill-dot" aria-hidden="true" />
      <button type="button" className="pill-main" onClick={goToDemo}>
        See Orderly in action
        <span className="pill-cta">Try it live</span>
      </button>
      <button
        type="button"
        className="pill-x"
        onClick={dismiss}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
