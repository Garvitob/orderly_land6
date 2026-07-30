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
 * graded plate measures 11.1:1 against Oat, which is AAA, so there is no text
 * shadow anywhere here and never will be.
 */
export function Room() {
  const root = useRef<HTMLElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const display = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    initGsap();
    const rootEl = root.current;
    const displayEl = display.current;
    if (!rootEl || !displayEl) return;

    // Reduced motion: everything at its final position and opacity (§10.4).
    if (prefersReducedMotion()) {
      gsap.set(rootEl.querySelectorAll("[data-lift]"), { opacity: 1, y: 0 });
      return;
    }

    let split: SplitText | null = null;

    const ctx = gsap.context(() => {
      // Words mask up from below. `mask: "words"` gives each word its own
      // clipping wrapper, so the type rises out of nothing rather than
      // sliding over neighbouring lines.
      split = new SplitText(displayEl, { type: "words", mask: "words" });

      const tl = gsap.timeline();

      tl.from(split.words, {
        yPercent: 115,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.08,
      }).from(
        rootEl.querySelectorAll("[data-lift]"),
        {
          opacity: 0,
          y: 18,
          duration: 0.85,
          ease: "shift",
          stagger: 0.07,
        },
        0.32,
      );
    }, rootEl);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section id="top" ref={root} className="room act1-scope">
      <HeroVideo videoRef={video} />
      <div className="room-scrim" aria-hidden="true" />

      <div className="room-inner">
        <div className="room-type">
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
