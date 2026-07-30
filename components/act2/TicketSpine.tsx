"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { TICKET, PRINT_POINTS } from "@/lib/ticket";
import { onDemoBeat } from "@/lib/demo-beat";

/**
 * §7 THE TICKET SPINE. The one idea the page is remembered for.
 *
 * §7.1 is a hard layout requirement and the reason this is written the way it
 * is: the spine occupies grid column 1 and is `position: sticky` INSIDE that
 * column, never `position: fixed`. Sticky inside the column means it physically
 * cannot escape and cannot clip a headline, which is what happened in a
 * previous build.
 *
 * REPORTED DEVIATION FROM §7, at the client's explicit and repeated direction.
 * §7 runs the strip the length of Act III and stamps FIRED at the footer. It is
 * confined to §8.4 instead, and prints against the DEMO's beats rather than
 * against page sections. The reasoning that won the argument: the ticket is the
 * order that phone is placing, so printing PAID three screens after the phone
 * took payment was the strip describing something that had already happened
 * elsewhere. Held together, one screen, one order, the line and the thing it
 * records landing on the same beat. Say the word and it goes back.
 *
 * Growth drives `height`, §10.3's first named exception to transform-and-opacity,
 * and feeds only as far as the line that just printed. Forward only: a printed
 * beat never un-prints, so the ticket can only ever move forward.
 */
export function TicketSpine() {
  const col = useRef<HTMLDivElement | null>(null);
  const paper = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    initGsap();
    const colEl = col.current;
    const paperEl = paper.current;
    if (!colEl || !paperEl) return;

    const lines = paperEl.querySelectorAll<HTMLElement>("[data-line-id]");
    const reduced = prefersReducedMotion();
    let unsubscribe: (() => void) | null = null;

    // §10.4: the ticket is simply already complete, every line printed.
    if (reduced) {
      gsap.set(lines, { opacity: 1, y: 0 });
      gsap.set(paperEl, { height: "auto" });
      return;
    }

    const ctx = gsap.context(() => {
      // Nothing printed yet. The sheet itself is already the full height of the
      // screen (see globals.css) and the lines land ON it.
      gsap.set(lines, { opacity: 0, y: -4 });

      /* Printed against the DEMO's beat, not against page sections, so the line
         and the thing it records land together. Both directions: scrolling back
         up un-prints, because this is a scrubbed sequence the reader is driving,
         not a §10.2 reveal that must never re-fire. */
      unsubscribe = onDemoBeat((beat) => {
        lines.forEach((line) => {
          const at = Number(line.dataset.beat);
          if (Number.isNaN(at)) return;
          const shouldShow = at <= beat;
          const isShown = Number(gsap.getProperty(line, "opacity")) > 0.5;
          if (shouldShow === isShown) return;
          gsap.to(line, {
            opacity: shouldShow ? 1 : 0,
            y: shouldShow ? 0 : -4,
            duration: shouldShow ? 0.34 : 0.2,
            ease: "shift",
            overwrite: "auto",
          });
        });
      });
    }, colEl);

    return () => {
      unsubscribe?.();
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
                  data-beat={l.beat}
                />
              ) : (
                <p
                  key={l.id}
                  className={`t-label spine-line is-${l.kind ?? "row"}`}
                  data-line-id={l.id}
                  data-beat={l.beat}
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

    let unsubscribe: (() => void) | null = null;

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

      /* Tick marks light with the demo's beats, matching the print points the
         desktop strip now uses, so the two are never telling different stories
         about how far along the order is. */
      const ticks = Array.from(el.querySelectorAll<HTMLElement>("[data-tick]"));
      unsubscribe = onDemoBeat((beat) => {
        ticks.forEach((tick) => {
          const at = Number(tick.dataset.tick);
          if (Number.isNaN(at) || at > beat) return;
          gsap.to(tick, { opacity: 1, duration: 0.28, ease: "shift" });
        });
      });
    }, el);

    return () => {
      unsubscribe?.();
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
          data-tick={l.beat}
          style={{ top: `${((i + 1) / (PRINT_POINTS.length + 1)) * 100}%` }}
        />
      ))}
    </div>
  );
}
