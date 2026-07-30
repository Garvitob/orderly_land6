"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { TICKET, PRINT_POINTS } from "@/lib/ticket";

/**
 * §7 THE TICKET SPINE. The one idea the page is remembered for.
 *
 * §7.1 is a hard layout requirement and the reason this is written the way it
 * is: the spine occupies grid column 1 and is `position: sticky` INSIDE that
 * column, never `position: fixed`. Sticky inside the column means it physically
 * cannot escape and cannot clip a headline, which is what happened in a
 * previous build.
 *
 * Growth is one scrubbed ScrollTrigger over Act III driving `height`, which is
 * §10.3's first named exception to transform-and-opacity. Lines print from each
 * section's own onEnter with once:true, so nothing re-prints on scroll-up and
 * the ticket can only ever move forward.
 *
 * The final line is the payoff: FIRED stamps in Basil with SERVICE COMPLETE
 * beside it (§8.15).
 */
export function TicketSpine() {
  const col = useRef<HTMLDivElement | null>(null);
  const paper = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    initGsap();
    const colEl = col.current;
    const paperEl = paper.current;
    if (!colEl || !paperEl) return;

    const act3 = document.querySelector<HTMLElement>(".act3");
    const lines = paperEl.querySelectorAll<HTMLElement>("[data-line-id]");
    const reduced = prefersReducedMotion();

    // §10.4: the ticket is simply already complete, every line printed.
    if (reduced) {
      gsap.set(lines, { opacity: 1, y: 0 });
      gsap.set(paperEl, { height: "auto" });
      return;
    }

    const ctx = gsap.context(() => {
      // Each line prints when its own section arrives. once:true, always.
      lines.forEach((line) => {
        const at = line.dataset.at;
        if (!at) return;
        const section = document.getElementById(at);
        if (!section) return;

        gsap.fromTo(
          line,
          { opacity: 0, y: -4 },
          {
            opacity: 1,
            y: 0,
            duration: 0.34,
            ease: "shift",
            immediateRender: false,
            scrollTrigger: { trigger: section, start: "top 62%", once: true },
          },
        );
      });

      // Growth: the paper feeds out as Act III scrolls. Measured from the
      // content so it always ends exactly at its natural height.
      if (act3) {
        const full = () => paperEl.scrollHeight;
        gsap.fromTo(
          paperEl,
          { height: 96 },
          {
            height: full,
            ease: "none",
            scrollTrigger: {
              trigger: act3,
              start: "top 70%",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      }
    }, colEl);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="spine-col" ref={col} aria-hidden="true">
      <div className="spine-sticky">
        <div className="spine-paper paper-scope" ref={paper} data-spine-paper>
          <div className="spine-perf" />
          <div className="spine-lines">
            <p className="spine-dots">· · · · · ·</p>

            {TICKET.map((l) =>
              l.kind === "rule" ? (
                <span
                  key={l.id}
                  className="spine-hr"
                  data-line-id={l.id}
                  data-at={l.at}
                />
              ) : (
                <p
                  key={l.id}
                  className={`t-label spine-line is-${l.kind ?? "row"}`}
                  data-line-id={l.id}
                  data-at={l.at}
                >
                  <span>{l.left}</span>
                  {l.right ? <span>{l.right}</span> : null}
                </p>
              ),
            )}

            <p className="spine-dots">· · · · · ·</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * §7.1 / §11: below 1280px the spine is replaced by a 2px progress rail flush
 * to the left viewport edge, with tick marks at the same print points.
 */
export function TicketSpineMobile() {
  const rail = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    initGsap();
    const el = rail.current;
    if (!el) return;
    const fill = el.querySelector<HTMLElement>("[data-rail-fill]");
    const act3 = document.querySelector<HTMLElement>(".act3");
    if (!fill || !act3) return;

    if (prefersReducedMotion()) {
      gsap.set(fill, { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: act3,
            start: "top 70%",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      // Tick marks light as their section arrives, matching the print points.
      el.querySelectorAll<HTMLElement>("[data-tick]").forEach((tick) => {
        const at = tick.dataset.tick;
        if (!at) return;
        const section = document.getElementById(at);
        if (!section) return;
        gsap.to(tick, {
          opacity: 1,
          duration: 0.28,
          ease: "shift",
          scrollTrigger: { trigger: section, start: "top 62%", once: true },
        });
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="rail" ref={rail} aria-hidden="true">
      <div className="rail-fill" data-rail-fill />
      {PRINT_POINTS.map((l, i) => (
        <span
          key={l.id}
          className="rail-tick"
          data-tick={l.at}
          style={{ top: `${((i + 1) / (PRINT_POINTS.length + 1)) * 100}%` }}
        />
      ))}
    </div>
  );
}
