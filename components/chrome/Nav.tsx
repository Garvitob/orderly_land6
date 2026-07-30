"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { COPY } from "@/lib/copy";
import { Mark } from "@/components/chrome/Mark";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { Button } from "@/components/primitives/Button";

const MARK_DRAWN_KEY = "orderly-mark-drawn";

/**
 * §8.1. Over the video with no fill and no blur. Centre links are hidden in
 * Act I so the first screen is four lines of type and one button, and nothing
 * competes. They fade up at the turn (step 7 drives data-phase).
 *
 * §4.6's one permitted logo animation lives here: a DrawSVG stroke reveal,
 * once per session, after which the mark is static forever. The stroke fades
 * out at the end so the resting mark is pure fill, identical to every other
 * instance. The kit forbids altering the mark, and a permanent 3px stroke
 * would be an alteration.
 */
export function Nav() {
  const markPath = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    initGsap();
    const path = markPath.current;
    if (!path) return;

    let alreadyDrawn = false;
    try {
      alreadyDrawn = sessionStorage.getItem(MARK_DRAWN_KEY) === "1";
    } catch {
      alreadyDrawn = false;
    }

    if (alreadyDrawn || prefersReducedMotion()) {
      gsap.set(path, { drawSVG: "100%", fillOpacity: 1, strokeOpacity: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .set(path, { fillOpacity: 0, strokeOpacity: 1 })
        .fromTo(
          path,
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.7, ease: "shift" },
        )
        .to(path, { fillOpacity: 1, duration: 0.28, ease: "none" }, 0.46)
        .to(path, { strokeOpacity: 0, duration: 0.22, ease: "none" }, 0.62);
    });

    try {
      sessionStorage.setItem(MARK_DRAWN_KEY, "1");
    } catch {
      // private mode. it simply draws again next load.
    }

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <header className="onav act1-scope" data-phase="act1">
      <div className="onav-inner">
        <a className="onav-brand" href="#top">
          <Mark size={32} drawable pathRef={(el) => (markPath.current = el)} />
          <span>{COPY.brand}</span>
        </a>

        <nav className="onav-links" aria-label="Sections">
          {COPY.nav.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="onav-right">
          <ThemeToggle />
          <Button variant="solid" className="onav-cta">
            {COPY.act1.ctaPrimary}
          </Button>
        </div>
      </div>
    </header>
  );
}
