"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { Label } from "@/components/primitives/Label";

const NODES = [
  {
    id: "guest",
    title: "The guest",
    line: "A QR on the table. No app, no sign up.",
  },
  {
    id: "orderly",
    title: "Orderly",
    line: "Every question answered, every customization captured.",
  },
  {
    id: "pos",
    title: "Your POS",
    line: "Toast, Square, Clover or Shift4. The one you already run.",
  },
  {
    id: "kitchen",
    title: "The kitchen",
    line: "A clean ticket, same as any other.",
  },
] as const;

const CHIPS = ["no onions", "extra cheese", "make it mild", "gluten free"] as const;
const POS = ["Toast", "Square", "Clover", "Shift4"] as const;

/**
 * §8.9 ONE ORDER, END TO END. Answers: where does the order go? Do I change
 * anything?
 *
 * Deliberately FEW control points. The brief's own prescribed fix for judder is
 * a simpler path, not more easing, so the path starts simple rather than being
 * simplified later: two straight runs joined by two quarter-turns.
 *
 * The receipt rides it with autoRotate so it banks into the curves. Every node
 * fires once:true on arrival.
 *
 * ONE ORANGE ACCENT: the Toast pill fill at node 3.
 */
export function Journey() {
  const root = useRef<HTMLElement | null>(null);
  const path = useRef<SVGPathElement | null>(null);
  const rider = useRef<SVGGElement | null>(null);
  const players = useRef<Record<string, () => void>>({});

  const replay = (id: string) => {
    players.current[id]?.();
  };

  useEffect(() => {
    initGsap();
    const rootEl = root.current;
    const pathEl = path.current;
    const riderEl = rider.current;
    if (!rootEl) return;

    const reduced = prefersReducedMotion();
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      /* ── the four node animations, shared by desktop and mobile ────── */
      const nodeTimelines = () => {
        // node 1: the QR draws itself
        const finders = rootEl.querySelectorAll<SVGRectElement>("[data-finder]");
        const modules = rootEl.querySelectorAll<SVGRectElement>("[data-module]");
        gsap.set(finders, { drawSVG: reduced ? "100%" : "0%" });
        gsap.set(modules, { opacity: reduced ? 1 : 0 });

        if (!reduced) {
          const tl1 = gsap.timeline({
            immediateRender: false,
            scrollTrigger: {
              trigger: rootEl.querySelector("[data-node='guest']"),
              start: "top 72%",
              once: true,
            },
          });
          tl1.to(finders, {
            drawSVG: "100%",
            duration: 0.8,
            ease: "shift",
            stagger: 0.15,
          });
          // modules fade in from a shuffled order, 12ms each
          const order = Array.from(modules).map((m, i) => ({ m, i }));
          for (let i = order.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [order[i], order[j]] = [order[j], order[i]];
          }
          tl1.to(
            order.map((o) => o.m),
            { opacity: 1, duration: 0.2, stagger: 0.012, ease: "none" },
            0.45,
          );
        }

        // node 2: modifier chips snap onto their line items
        const chips = rootEl.querySelectorAll<HTMLElement>("[data-chip]");
        if (reduced) {
          gsap.set(chips, { opacity: 1, x: 0, y: 0 });
        } else {
          gsap.fromTo(
            chips,
            { opacity: 0, x: 26, y: -10 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.5,
              ease: "back.out(2.2)",
              stagger: 0.16,
              immediateRender: false,
              scrollTrigger: {
                trigger: rootEl.querySelector("[data-node='orderly']"),
                start: "top 72%",
                once: true,
              },
            },
          );
        }

        // node 3: POS pills dock in sequence with slight overshoot
        const pills = rootEl.querySelectorAll<HTMLElement>("[data-pill]");
        if (reduced) {
          gsap.set(pills, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            pills,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.44,
              ease: "back.out(1.7)",
              stagger: 0.11,
              immediateRender: false,
              scrollTrigger: {
                trigger: rootEl.querySelector("[data-node='pos']"),
                start: "top 72%",
                once: true,
              },
            },
          );
        }

        // node 4: the printer feeds, then FIRED stamps and shakes
        const ticket = rootEl.querySelector<HTMLElement>("[data-printed]");
        const fired = rootEl.querySelector<HTMLElement>("[data-fired]");
        if (reduced) {
          if (ticket) gsap.set(ticket, { scaleY: 1 });
          if (fired) gsap.set(fired, { opacity: 1, scale: 1, rotate: 9 });
        } else if (ticket && fired) {
          const tl4 = gsap.timeline({
            immediateRender: false,
            scrollTrigger: {
              trigger: rootEl.querySelector("[data-node='kitchen']"),
              start: "top 74%",
              once: true,
            },
          });
          tl4
            .fromTo(
              ticket,
              { scaleY: 0 },
              { scaleY: 1, duration: 0.62, ease: "power2.out" },
            )
            .fromTo(
              fired,
              { opacity: 0, scale: 0.7, rotate: 22 },
              {
                opacity: 1,
                scale: 1,
                rotate: 9,
                duration: 0.7,
                ease: "elastic.out(1, 0.4)",
              },
              0.5,
            )
            // a 3-cycle 3px shake, as specified
            .to(
              fired,
              { x: 3, duration: 0.05, repeat: 5, yoyo: true, ease: "none" },
              0.62,
            )
            .set(fired, { x: 0 });
        }
      };

      nodeTimelines();

      /* Replayable milestones. The animation IS the explanation here, so a
         reader who missed one should be able to run it again without hunting
         for the scroll position that fired it. These play immediately and
         carry no ScrollTrigger. */
      const q = <T extends Element>(s: string) =>
        Array.from(rootEl.querySelectorAll<T>(s));

      players.current = {
        guest: () => {
          const finders = q<SVGRectElement>("[data-finder]");
          const modules = q<SVGRectElement>("[data-module]");
          const tl = gsap.timeline();
          tl.fromTo(finders, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8, ease: "shift", stagger: 0.15 })
            .fromTo(modules, { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: { each: 0.012, from: "random" }, ease: "none" }, 0.45);
        },
        orderly: () => {
          gsap.fromTo(
            q<HTMLElement>("[data-chip]"),
            { opacity: 0, x: 26, y: -10 },
            { opacity: 1, x: 0, y: 0, duration: 0.5, ease: "back.out(2.2)", stagger: 0.16 },
          );
        },
        pos: () => {
          gsap.fromTo(
            q<HTMLElement>("[data-pill]"),
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.44, ease: "back.out(1.7)", stagger: 0.11 },
          );
        },
        kitchen: () => {
          const ticket = rootEl.querySelector<HTMLElement>("[data-printed]");
          const fired = rootEl.querySelector<HTMLElement>("[data-fired]");
          if (!ticket || !fired) return;
          gsap
            .timeline()
            .fromTo(ticket, { scaleY: 0 }, { scaleY: 1, duration: 0.62, ease: "power2.out" })
            .fromTo(
              fired,
              { opacity: 0, scale: 0.7, rotate: 22 },
              { opacity: 1, scale: 1, rotate: 9, duration: 0.7, ease: "elastic.out(1, 0.4)" },
              0.5,
            )
            .to(fired, { x: 3, duration: 0.05, repeat: 5, yoyo: true, ease: "none" }, 0.62)
            .set(fired, { x: 0 });
        },
      };

      // The milestone number ring draws itself as each node arrives.
      q<SVGCircleElement>("[data-ring]").forEach((ring) => {
        const node = ring.closest<HTMLElement>("[data-node]");
        if (!node) return;
        gsap.fromTo(
          ring,
          { drawSVG: reduced ? "100%" : "0%" },
          {
            drawSVG: "100%",
            duration: 0.7,
            ease: "shift",
            immediateRender: false,
            scrollTrigger: { trigger: node, start: "top 78%", once: true },
          },
        );
      });

      /* ── the receipt rides the path, desktop only ──────────────────── */
      mm.add("(min-width: 1024px)", () => {
        if (!pathEl || !riderEl || reduced) return;

        gsap.fromTo(
          pathEl,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: rootEl,
              start: "top 68%",
              end: "bottom 72%",
              scrub: true,
            },
          },
        );

        gsap.to(riderEl, {
          motionPath: {
            path: pathEl,
            align: pathEl,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
          },
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: rootEl,
            start: "top 68%",
            end: "bottom 72%",
            scrub: true,
          },
        });
      });

      /* ── mobile: a straight vertical line, drawn with scaleY ───────── */
      mm.add("(max-width: 1023px)", () => {
        const spine = rootEl.querySelector<HTMLElement>("[data-jspine]");
        if (!spine || reduced) return;
        gsap.fromTo(
          spine,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: rootEl,
              start: "top 76%",
              end: "bottom 76%",
              scrub: true,
            },
          },
        );
      });
    }, rootEl);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section id="journey" ref={root} className="journey">
      {/* THE MANDATED RULE-BREAK: this headline runs past the right viewport
          edge and is clipped. No fade, no mask. */}
      <div className="journey-headwrap">
        <Label tone="text-2">One order, end to end</Label>
        <h2 className="t-display journey-head">
          One order, from the table to the ticket.
        </h2>
      </div>

      {/* Desktop path. Two straight runs joined by two quarter-turns: six
          control points total, which is what keeps the rider from juddering. */}
      <svg
        className="journey-svg"
        viewBox="0 0 900 1180"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={path}
          d="M70,80 L760,80 Q830,80 830,150 L830,560 Q830,630 760,630 L140,630 Q70,630 70,700 L70,1120"
          fill="none"
          stroke="var(--rule)"
          strokeWidth="1"
        />
        <g ref={rider}>
          <rect
            x="-11"
            y="-15"
            width="22"
            height="30"
            fill="var(--paper)"
            stroke="var(--text)"
            strokeWidth="1"
          />
          <path
            d="M-6,-8 H6 M-6,-3 H6 M-6,2 H2"
            stroke="var(--text-2)"
            strokeWidth="1"
          />
        </g>
      </svg>

      {/* Mobile line */}
      <span className="journey-mspine" data-jspine aria-hidden="true" />

      <ol className="journey-nodes">
        {NODES.map((n, i) => (
          <li key={n.id} className="jnode" data-node={n.id}>
            {/* Clickable: replaying a milestone is the natural thing to want
                when the animation is the explanation. */}
            <button
              type="button"
              className="jnode-head"
              onClick={() => replay(n.id)}
              aria-label={`Replay ${n.title}`}
            >
              <span className="jnode-num" data-num>
                <svg viewBox="0 0 34 34" aria-hidden="true">
                  <circle
                    data-ring
                    cx="17"
                    cy="17"
                    r="15.5"
                    fill="none"
                    stroke="var(--text)"
                    strokeWidth="1"
                  />
                </svg>
                <em>{i + 1}</em>
              </span>
              <Label tone="text-2">{n.title}</Label>
              <span className="jnode-replay t-label" aria-hidden="true">
                Replay
              </span>
            </button>

            <p className="t-subhead jnode-line">{n.line}</p>

            <div className="jnode-vis">
              {n.id === "guest" ? (
                <svg viewBox="0 0 84 84" className="qr" aria-hidden="true">
                  {[
                    [4, 4],
                    [58, 4],
                    [4, 58],
                  ].map(([x, y]) => (
                    <rect
                      key={`${x}-${y}`}
                      data-finder
                      x={x}
                      y={y}
                      width="22"
                      height="22"
                      fill="none"
                      stroke="var(--text)"
                      strokeWidth="4"
                    />
                  ))}
                  {Array.from({ length: 13 * 13 }).map((_, i) => {
                    const cx = i % 13;
                    const cy = Math.floor(i / 13);
                    // leave the three finder zones clear
                    const inFinder =
                      (cx < 4 && cy < 4) || (cx > 8 && cy < 4) || (cx < 4 && cy > 8);
                    if (inFinder) return null;
                    // deterministic pattern: no Math.random during render (§14.1)
                    if ((cx * 7 + cy * 5 + cx * cy) % 3 === 0) return null;
                    return (
                      <rect
                        key={i}
                        data-module
                        x={cx * 6.2 + 3}
                        y={cy * 6.2 + 3}
                        width="4.6"
                        height="4.6"
                        fill="var(--text)"
                      />
                    );
                  })}
                </svg>
              ) : null}

              {n.id === "orderly" ? (
                <div className="jchips">
                  {CHIPS.map((c) => (
                    <span key={c} data-chip className="chip jchip">
                      {c}
                    </span>
                  ))}
                </div>
              ) : null}

              {n.id === "pos" ? (
                <div className="jpills">
                  {POS.map((p) => (
                    <span
                      key={p}
                      data-pill
                      className={`jpill ${p === "Toast" ? "is-live" : ""}`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              ) : null}

              {n.id === "kitchen" ? (
                <div className="jprint">
                  <div className="jticket" data-printed>
                    <span className="t-label">Table 12</span>
                    <span className="t-label">1× smash › mild</span>
                    <span className="t-label">1× mac</span>
                    <span className="t-label">1× fries</span>
                  </div>
                  <span className="jfired t-label" data-fired>
                    Fired
                  </span>
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <div className="journey-margin">
        <h3 className="t-headline">We don&rsquo;t replace your system. We amplify it.</h3>
        <p className="t-body sec-sub">
          Orderly plugs into your existing point of sale with no new hardware.
          Every order flows from the guest to the kitchen just as it should.
        </p>
      </div>
    </section>
  );
}
