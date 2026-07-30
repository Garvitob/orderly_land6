"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { COPY } from "@/lib/copy";
import { Label } from "@/components/primitives/Label";
import { Button, TextLink } from "@/components/primitives/Button";
import { HeroVideo } from "./HeroVideo";
import { Overheard } from "./Overheard";
import { ScrollCue } from "./ScrollCue";

/**
 * §8.2 THE ROOM. Answers: what is this, and is it for someone like me?
 *
 * One column, left-aligned, starting at the gutter, roughly 52% of width.
 * Deliberately not centred: the right half is the room, and it stays empty.
 *
 * Type protection is a soft radial scrim behind the type block only. The
 * graded plate measures 15:1 at p95 against Oat, so there is no text shadow
 * anywhere here and never will be.
 *
 * The camera push belongs to the reader: scale 1.02 to 1.10 is scrubbed by
 * their scroll, never baked into the file and never a CSS animation running on
 * its own clock. A baked move would fight the scrub.
 */
export function Room() {
  const root = useRef<HTMLElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const display = useRef<HTMLHeadingElement | null>(null);
  const typeBlock = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    initGsap();
    const rootEl = root.current;
    const displayEl = display.current;
    const typeEl = typeBlock.current;
    if (!rootEl || !displayEl || !typeEl) return;

    const media = rootEl.querySelector<HTMLElement>(".room-media");
    const cue = rootEl.querySelector<HTMLElement>(".scrollcue");
    const lines = typeEl.querySelectorAll<HTMLElement>(":scope > *");

    // §10.4: everything at its final position, no pin, no scrub, no split.
    if (prefersReducedMotion()) {
      gsap.set(rootEl.querySelectorAll("[data-lift]"), { opacity: 1, y: 0 });
      return;
    }

    let split: SplitText | null = null;
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      /* ── load entrance ─────────────────────────────────────────────── */
      // Words mask up from below. `mask: "words"` gives each word its own
      // clipping wrapper, so type rises out of nothing rather than sliding
      // over neighbouring lines.
      split = new SplitText(displayEl, { type: "words", mask: "words" });

      gsap
        .timeline()
        .from(split.words, {
          yPercent: 115,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.08,
        })
        .from(
          rootEl.querySelectorAll("[data-lift]"),
          { opacity: 0, y: 18, duration: 0.85, ease: "shift", stagger: 0.07 },
          0.32,
        );

      /* ── the scrub, desktop only ───────────────────────────────────── */
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootEl,
            start: "top top",
            end: "+=130%",
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: true,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "none" },
        });

        // 0 → 0.55  the room draws you in. Slow, almost imperceptible.
        if (media) tl.to(media, { scale: 1.1, duration: 0.55 }, 0);
        tl.to(typeEl, { y: -60, opacity: 0.85, duration: 0.55 }, 0);

        // 0.55 → 0.80  the type leaves in the order it arrived.
        // The stagger has to CLOSE by 0.80, not start by it: with 5 lines the
        // last one begins at 4 x stagger, so 4(0.03) + 0.13 = 0.25 lands it
        // exactly on 0.80. At duration 0.22 it ran to 0.91 and was still
        // fading while the room darkened.
        tl.to(typeEl, { y: -140, duration: 0.25 }, 0.55);
        tl.to(lines, { opacity: 0, duration: 0.13, stagger: 0.03 }, 0.55);

        // cue gone by 0.6
        if (cue) tl.to(cue, { opacity: 0, duration: 0.05 }, 0.55);

        // 0.80 → 1 is the turn (§8.3), authored at step 7. The pin already
        // reserves that scroll so adding it changes no geometry.
        tl.to({}, { duration: 0.2 }, 0.8);
      });

      /* ── mobile: no pin, no scrub, one honest fade out ─────────────── */
      mm.add("(max-width: 1023px)", () => {
        gsap.to(typeEl, {
          opacity: 0,
          duration: 0.6,
          ease: "shift",
          scrollTrigger: {
            trigger: rootEl,
            start: "bottom 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, rootEl);

    return () => {
      mm.revert();
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section id="top" ref={root} className="room act1-scope">
      <HeroVideo videoRef={video} />
      <div className="room-scrim" aria-hidden="true" />

      <div className="room-inner">
        <div className="room-type" ref={typeBlock}>
          <div data-lift>
            <Label tone="orange" as="p">
              {COPY.act1.label}
            </Label>
          </div>

          <h1 ref={display} className="t-act1-display room-display">
            {COPY.act1.display}
          </h1>

          <p className="t-subhead room-sub" data-lift>
            {COPY.act1.subhead}
          </p>

          <div data-lift>
            <Overheard />
          </div>

          <div className="room-cta" data-lift>
            <Button variant="solid">{COPY.act1.ctaPrimary}</Button>
            <TextLink href="#guest">{COPY.act1.ctaSecondary}</TextLink>
          </div>
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}
