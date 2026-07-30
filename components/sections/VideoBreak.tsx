"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion, useReducedMotion } from "@/lib/useReducedMotion";
import { Label } from "@/components/primitives/Label";

/**
 * §8.8 the full-bleed break. Edge to edge, 0 radius, 48vh desktop / 34vh mobile.
 *
 * This is the ONLY place in Act III where text sits on footage, and it is
 * sanctioned because the brand kit prescribes exactly this treatment for
 * section breaks: image full bleed, ink gradient scrim from the bottom, white
 * type. §5.1's ban is on a ROW of scrimmed photo cards, which this is not.
 *
 * Parallax y: -8% across the scroll, no zoom. Same §3.2 markup rules as the
 * hero, including never using the autoPlay prop.
 *
 * ONE ORANGE ACCENT: none. Orange on footage is orange as atmosphere.
 */
export function VideoBreak() {
  const root = useRef<HTMLElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    initGsap();
    const rootEl = root.current;
    if (!rootEl) return;

    const media = rootEl.querySelector<HTMLElement>(".vb-media");
    const el = video.current;

    if (el && !reduced && !failed) {
      void el.play().catch(() => {});
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) void el.play().catch(() => {});
            else el.pause();
          }
        },
        { threshold: 0.01 },
      );
      io.observe(el);

      const ctx = gsap.context(() => {
        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: rootEl,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      }, rootEl);

      return () => {
        io.disconnect();
        el.pause();
        ctx.revert();
      };
    }

    if (prefersReducedMotion() && media) gsap.set(media, { yPercent: 0 });
    return undefined;
  }, [reduced, failed]);

  return (
    <section id="break" ref={root} className="videobreak">
      {reduced || failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="vb-media"
          src="/video/break-poster.jpg"
          alt=""
          aria-hidden="true"
        />
      ) : (
        <video
          ref={video}
          className="vb-media"
          poster="/video/break-poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onError={() => setFailed(true)}
        >
          <source src="/video/break.webm" type="video/webm" />
          <source src="/video/break.mp4" type="video/mp4" />
        </video>
      )}

      <div className="vb-scrim" aria-hidden="true" />

      <div className="vb-copy">
        {/* Fixes a real comprehension hole: §1 insists the product is not only
            tables, and the four placements appeared nowhere in the headline-only
            extraction. */}
        <Label tone="oat">Menu · table · counter · drive thru</Label>
        <h2 className="t-headline vb-head">Every table, every night.</h2>
      </div>
    </section>
  );
}
