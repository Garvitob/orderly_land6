"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { useMediaQuery, DESKTOP } from "@/lib/useMediaQuery";
import { Label } from "@/components/primitives/Label";
import { VoiceBars } from "@/components/demo/VoiceBars";
import { money } from "@/lib/menu";

/** §8.6, copy verbatim. */
const PANELS = [
  {
    id: "chat",
    title: "Chat Mode",
    copy: "A seamless text alternative through the same interface.",
  },
  {
    id: "browse",
    title: "Browse Menu",
    copy: "Photos, prices and every modifier in one place.",
  },
  {
    id: "voice",
    title: "Voice Ordering",
    copy: "Guests speak naturally. Every order lands perfectly.",
  },
  {
    id: "upsell",
    title: "Intelligent Upselling",
    copy: "More of what guests love, at the right moment.",
  },
] as const;

const ROWS = ["Smash Burger", "Mac and Cheese", "Garlic Fries", "Vanilla Shake"];

/**
 * §8.6 FOUR WAYS IN. Answers: what if my guests hate talking to machines?
 *
 * Four vertical panels, not a card grid. At rest each is flex: 1; active
 * expands to flex: 2.4 and the others compress. Collapsed panels show only a
 * Label title in writing-mode: vertical-rl, reading bottom to top.
 *
 * flex-grow is §10.3's second named exception. The transition is origin aware
 * (it grows from the edge the cursor entered) and interruptible, because it is
 * a CSS transition and re-hovering retargets rather than queueing (§10.1).
 *
 * ONE ORANGE ACCENT: the active panel's Label title.
 */
export function Modes() {
  const root = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const isDesktop = useMediaQuery(DESKTOP);

  useEffect(() => {
    initGsap();
    const rootEl = root.current;
    if (!rootEl || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(rootEl.querySelectorAll("[data-panel]"), {
        opacity: 0,
        y: 26,
        duration: 0.8,
        ease: "shift",
        stagger: 0.07,
        immediateRender: false,
        scrollTrigger: { trigger: rootEl, start: "top 74%", once: true },
      });
    }, rootEl);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section id="modes" ref={root} className="sec modes">
      <div className="modes-copy">
        <Label tone="text-2">Every guest, their way</Label>
        <h2 className="t-headline sec-head">Four ways in. Your guests pick.</h2>
        <p className="t-body sec-sub">
          Nobody is forced to talk to anything. Same page, same order, whichever
          way they choose.
        </p>
      </div>

      <div className="panels" role="tablist" aria-label="Ways to order">
        {PANELS.map((p, i) => (
          <div
            key={p.id}
            data-panel
            className={`panel ${i === active ? "is-open" : ""}`}
            role="tab"
            aria-selected={i === active}
            tabIndex={0}
            onMouseEnter={isDesktop ? () => setActive(i) : undefined}
            onFocus={() => setActive(i)}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "ArrowRight") setActive((n) => Math.min(3, n + 1));
              if (e.key === "ArrowLeft") setActive((n) => Math.max(0, n - 1));
            }}
          >
            <span className="panel-spine">
              <Label tone={i === active ? "orange" : "text-2"}>{p.title}</Label>
            </span>

            <div className="panel-open">
              <Label tone="orange">{p.title}</Label>
              <p className="t-subhead panel-copy">{p.copy}</p>

              <div className="panel-anim">
                {p.id === "chat" ? (
                  <div className="mini-chat">
                    <p className="mini-bubble t-serif is-g">is this gluten free?</p>
                    <p className="mini-bubble t-serif is-o">
                      The farm salad is, and the Nashville hot without the bun.
                    </p>
                  </div>
                ) : null}

                {p.id === "browse" ? (
                  <ul className="mini-list">
                    {ROWS.map((r, n) => (
                      <li key={r} style={{ animationDelay: `${n * 0.9}s` }}>
                        <span className="t-serif">{r}</span>
                        <span className="tnum">{money([12.95, 11.5, 3.5, 4.5][n])}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {p.id === "voice" ? (
                  <div className="mini-voice">
                    <VoiceBars live={i === active} />
                  </div>
                ) : null}

                {p.id === "upsell" ? (
                  <div className="mini-upsell">
                    <span className="chip">Garlic fries</span>
                    <span className="mini-total tnum">
                      {money(28.95)} <em>→</em> {money(32.45)}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
