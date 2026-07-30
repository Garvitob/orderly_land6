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
import { Turn } from "@/components/act2/Turn";

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
    const dark = rootEl.querySelector<HTMLElement>("[data-turn-dark]");
    const card = rootEl.querySelector<HTMLElement>("[data-turn-card]");
    const paper = rootEl.querySelector<HTMLElement>("[data-turn-paper]");
    const turnSpine = rootEl.querySelector<HTMLElement>("[data-turn-spine]");

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
            // §8.1: the nav lands at the turn. Driven off progress rather
            // than a separate trigger so it can never disagree with the
            // paper wipe. The attribute lives on <html> so Nav does not
            // need to know Room exists.
            onUpdate: (self) => {
              // The paper wipes UP, so the nav strip is the LAST thing it
              // covers. Landing the nav at 0.86 put an Oat bar across the top
              // of a still-dark room. It lands when the paper actually
              // reaches it, which is the very end of the wipe.
              const phase = self.progress >= 0.99 ? "act3" : "act1";
              if (document.documentElement.dataset.phase !== phase) {
                document.documentElement.dataset.phase = phase;
              }
            },
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

        /* ── 0.80 → 1 · §8.3 THE TURN ──────────────────────────────────
           Four things at once, all inside the tail of this same pin so the
           whole turn is one scrubbed timeline and the pin releases into
           Act III with nothing left running. */

        // 1. the room goes dark. ease none, so it tracks scroll exactly.
        if (dark) tl.to(dark, { opacity: 1, duration: 0.1 }, 0.8);

        // 2. the title card, on the darkening plate. In at 0.86, out by 0.98.
        if (card) {
          tl.fromTo(
            card,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.04, immediateRender: false },
            0.86,
          );
          // Out by 0.94, not 0.98. The paper sits above the card and its
          // rising edge crosses the vertical centre at exactly 0.94, so a
          // later exit left the card sliced in half for ~40px of scroll.
          // Synchronised like this the paper appears to sweep the card away,
          // which is the better read anyway.
          tl.to(card, { opacity: 0, duration: 0.04 }, 0.9);
        }

        // 3. the paper wipes UP from the bottom edge. A wipe, not a fade.
        if (paper) {
          tl.fromTo(
            paper,
            { clipPath: "inset(100% 0 0 0)" },
            {
              clipPath: "inset(0% 0 0 0)",
              duration: 0.12,
              immediateRender: false,
            },
            0.88,
          );
        }

        // 4. the printer starts. Feeds from the top, power2.out over the
        //    equivalent of 600ms at this scrub rate.
        if (turnSpine) {
          tl.fromTo(
            turnSpine,
            { scaleY: 0 },
            {
              scaleY: 1,
              duration: 0.1,
              ease: "power2.out",
              immediateRender: false,
            },
            0.9,
          );
        }
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

        // §8.3 mobile: simplified and not scrubbed. The overlay darkens, the
        // paper wipes up, and the title card shows on its own for 800ms on an
        // onEnter rather than being tied to scroll position.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootEl,
            start: "bottom 92%",
            once: true,
          },
        });

        if (dark) tl.to(dark, { opacity: 1, duration: 0.5, ease: "none" }, 0);
        if (card) {
          tl.fromTo(
            card,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.4, ease: "shift" },
            0.15,
          ).to(card, { opacity: 0, duration: 0.3, ease: "none" }, 1.35);
        }
        if (paper) {
          tl.fromTo(
            paper,
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 0.7, ease: "shift" },
            1.1,
          );
        }
        tl.add(() => {
          document.documentElement.dataset.phase = "act3";
        }, 1.2);
      });
    }, rootEl);

    return () => {
      mm.revert();
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    // act1-scope sits on the inner type block, NOT on the section. The turn's
    // paper resolves var(--surface) and must get the REAL theme Oat; scoping
    // the whole section remapped --surface to the night plate and the paper
    // wiped up invisibly, black on black.
    <section id="top" ref={root} className="room">
      <HeroVideo videoRef={video} />
      <div className="room-scrim" aria-hidden="true" />

      <div className="room-inner act1-scope">
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
      <Turn />
    </section>
  );
}
