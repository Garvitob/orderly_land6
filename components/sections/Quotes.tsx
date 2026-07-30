"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { Label } from "@/components/primitives/Label";

/** §8.12, the three real quotes, verbatim. Invent nothing. */
const QUOTES = [
  {
    text: "It was a lot like talking to a server. It was very similar to a waitress. We didn't have a waitress around, so it was really cool. We were able to immediately ask the questions we wanted to ask and get recommendations.",
    who: "Orange Square diner",
  },
  {
    text: "I have gluten intolerance and I don't eat red meat. There was no way I was going to be able to order from that menu without talking to somebody. It would have taken me probably 20 minutes longer.",
    who: "Orange Square diner",
  },
  {
    text: "Before, pickup was just a phone number, and it confused customers all the time. Orderly makes it so easy. Even better, we're seeing ticket sizes grow.",
    who: "Grace, Orange Square operator",
  },
] as const;

/**
 * §8.12 WHAT THEY SAID. Answers: do real people say this, or just the sales page?
 *
 * Full-bleed orange. One of only two full-orange moments and where the 8%
 * budget is spent. Pin 3 of exactly 3.
 *
 * CONTRAST RULE, enforced structurally: white on orange is only legal at 18px
 * bold and above, so the quotes are Display scale in white and every Label and
 * attribution on this section is INK, not white.
 *
 * The gluten intolerance quote is the most persuasive sentence the client owns.
 * It gets the middle slot, where a reader who scrolls at all will land on it.
 */
export function Quotes() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    initGsap();
    const rootEl = root.current;
    if (!rootEl) return;

    const blocks = rootEl.querySelectorAll<HTMLElement>("[data-quote]");
    const counter = rootEl.querySelector<HTMLElement>("[data-count]");

    // §10.4: three stacked blocks, no pin, no scrub.
    if (prefersReducedMotion()) {
      gsap.set(blocks, { opacity: 1, y: 0, position: "relative" });
      rootEl.dataset.static = "true";
      return;
    }

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add("(min-width: 1024px)", () => {
        gsap.set(blocks, { opacity: 0, y: 30 });
        gsap.set(blocks[0], { opacity: 1, y: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootEl,
            start: "top top",
            end: "+=180%",
            pin: true,
            anticipatePin: 1,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (!counter) return;
              const n = Math.min(3, Math.floor(self.progress * 3) + 1);
              counter.textContent = `${n}/3`;
            },
          },
          defaults: { ease: "none" },
        });

        // each lifts out at y -30 as the next lifts in from y 30
        for (let i = 0; i < blocks.length - 1; i++) {
          const at = 0.3 + i * 0.3;
          tl.to(blocks[i], { opacity: 0, y: -30, duration: 0.12 }, at);
          tl.to(blocks[i + 1], { opacity: 1, y: 0, duration: 0.12 }, at + 0.06);
        }
        tl.to({}, { duration: 0.1 });
      });

      mm.add("(max-width: 1023px)", () => {
        rootEl.dataset.static = "true";
        blocks.forEach((b) => {
          gsap.fromTo(
            b,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "shift",
              scrollTrigger: { trigger: b, start: "top 82%", once: true },
            },
          );
        });
      });
    }, rootEl);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section id="quotes" ref={root} className="quotes">
      <div className="quotes-inner">
        <h2 className="t-headline quotes-head">
          Trusted by restaurants and diners that care about every table.
        </h2>

        <div className="quotes-stage">
          {QUOTES.map((q) => (
            <figure key={q.who + q.text.slice(0, 12)} className="quote" data-quote>
              <blockquote className="t-quote quote-text pull-optical">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              {/* Ink, never white: this is below the 18px-bold floor. */}
              <figcaption>
                <Label tone="ink">{q.who}</Label>
              </figcaption>
            </figure>
          ))}
        </div>

        <span className="quotes-count t-label" data-count>
          1/3
        </span>
      </div>
    </section>
  );
}
