"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { useMediaQuery, DESKTOP } from "@/lib/useMediaQuery";
import { Label } from "@/components/primitives/Label";
import { VoiceBars } from "@/components/demo/VoiceBars";
import { MENU, money } from "@/lib/menu";
import { COPY } from "@/lib/copy";

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

/* Read off the real menu rather than a hand-written list, so a price here can
   never drift away from §8.4's arithmetic. The whole menu, not four rows: four
   filled the top third of the panel and left the rest empty. */
const BROWSE_ROWS = MENU;

/* Both exchanges are the phone's own, so the panel and the demo say the same
   thing in the same voice (§6.4: every section stands alone, but the product
   only has one script). */
const CHAT_TURNS = [
  { who: "g", text: COPY.demoLines.askGlutenFree },
  { who: "o", text: COPY.demoLines.replyGlutenFree },
  { who: "g", text: COPY.demoLines.askMild },
  { who: "o", text: COPY.demoLines.replyMild },
] as const;

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

      {/* The grid breaks to an 8-column offset hanging right (§8.6), which left
          columns 1 to 3 under the copy empty. The index fills them and earns
          its place: it is the only spot where all four names are legible at
          once, because an open panel hides its neighbours' rotated titles.
          aria-hidden because the panels below already expose the same names to
          a screen reader, and this is the sighted reader's legend. */}
      <ul className="modes-index" aria-hidden="true">
        {PANELS.map((p, i) => (
          <li key={p.id} className={i === active ? "is-on" : ""}>
            <span className="t-label modes-index-n tnum">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="t-label modes-index-name">{p.title}</span>
          </li>
        ))}
      </ul>

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
                    {CHAT_TURNS.map((t, n) => (
                      <p
                        key={t.text}
                        className={`mini-bubble t-serif is-${t.who}`}
                        style={{ animationDelay: `${n * 0.85}s` }}
                      >
                        {t.text}
                      </p>
                    ))}
                  </div>
                ) : null}

                {/* §8.6: "A dish list scrolls, one row highlighting on a
                    cycle." The track holds the menu twice and travels -50%, so
                    the loop is seamless rather than snapping back. The second
                    copy is hidden from screen readers: it is the same menu. */}
                {p.id === "browse" ? (
                  <div className="mini-list-clip">
                    <div className="mini-list-track">
                      {[0, 1].map((copy) => (
                        <ul
                          className="mini-list"
                          key={copy}
                          aria-hidden={copy === 1 ? "true" : undefined}
                        >
                          {BROWSE_ROWS.map((d, n) => (
                            <li
                              key={`${d.id}-${copy}`}
                              style={{ animationDelay: `${n * 0.7}s` }}
                            >
                              <span className="mini-row-name">
                                <span className="t-serif">{d.name}</span>
                                <span className="mini-row-note">{d.note}</span>
                              </span>
                              <span className="tnum">{money(d.price)}</span>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  </div>
                ) : null}

                {p.id === "voice" ? (
                  <div className="mini-voice">
                    <span className="t-label mini-voice-cue">Listening</span>
                    <VoiceBars live={i === active} />
                    <p className="t-serif mini-transcript">
                      {COPY.demoLines.spoken}
                    </p>
                    <span className="t-label mini-voice-out">
                      1 &times; Vanilla Shake
                    </span>
                  </div>
                ) : null}

                {p.id === "upsell" ? (
                  <div className="mini-upsell">
                    <p className="t-serif mini-suggest">{COPY.demoLines.upsell}</p>
                    <div className="mini-upsell-row">
                      <span className="chip">Garlic fries</span>
                      <span className="mini-total tnum">
                        {money(28.95)} <em>&rarr;</em> {money(32.45)}
                      </span>
                    </div>
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
