"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/primitives/Label";
import { Button } from "@/components/primitives/Button";

/** §8.11, seven rows, copy verbatim. */
const ROWS = [
  {
    q: "Will my older guests actually use this?",
    a: "They browse the menu like any other web page. Voice and conversation are there if they want them. No app, no account, no sign up.",
  },
  {
    q: "Does this replace my servers?",
    a: "No. It takes the order so your staff can run the floor. Most operators tell us their team spends the saved time on tables that actually need them.",
  },
  {
    q: "What if my Wi-Fi drops?",
    a: "Guests order on their own cellular data. Orderly only needs a connection at the POS end, and orders queue and send the moment it is back.",
  },
  {
    q: "Do I need new hardware?",
    a: "No. Print the QR codes and you are running. Orderly plugs into the point of sale you already use: Toast, Square, Clover, or Shift4.",
  },
  {
    q: "How long does setup take?",
    a: "Under a week, and most of that is us building your menu properly so every modifier is right.",
  },
  {
    q: "What happens if it mishears someone?",
    a: "The guest sees every item on screen before they send it, and they can edit any line. That is why 98% accuracy shows up on the ticket, not just in a lab.",
  },
  {
    q: "What does it cost?",
    a: "It depends on your covers and locations. We will quote you on the demo call.",
  },
] as const;

/**
 * §8.11 STRAIGHT ANSWERS. Answers: the seven things I am actually worried about.
 *
 * Deliberately quiet. No photos, no cards, no icons: type, rules, one motion
 * idea. This is the rest between the motion path and the orange flood.
 *
 * Expansion animates a wrapper's grid-template-rows 0fr to 1fr, which is
 * §10.3's third named exception. No max-height hacks.
 *
 * ONE ORANGE ACCENT: the open row's ×.
 */
export function Answers() {
  const [open, setOpen] = useState(0);
  const headers = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (from: number, dir: 1 | -1) => {
    const next = (from + dir + ROWS.length) % ROWS.length;
    headers.current[next]?.focus();
  };

  return (
    <section id="answers" className="sec answers">
      <div className="answers-main">
        <Label tone="text-2">Before you ask</Label>
        <h2 className="t-headline sec-head">
          The questions every operator asks us.
        </h2>
        <p className="t-body sec-sub">
          Short answers. Ask us anything else on the demo call.
        </p>

        <ul className="acc">
          {ROWS.map((r, i) => {
            const isOpen = i === open;
            return (
              <li key={r.q} className="acc-row">
                <span className="acc-num t-label">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <button
                  ref={(el) => {
                    headers.current[i] = el;
                  }}
                  type="button"
                  className="acc-head"
                  aria-expanded={isOpen}
                  aria-controls={`acc-panel-${i}`}
                  id={`acc-head-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      move(i, 1);
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      move(i, -1);
                    }
                  }}
                >
                  <span className="t-subhead acc-q">{r.q}</span>
                  <span
                    className={`acc-sign ${isOpen ? "is-open" : ""}`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <div
                  className={`acc-wrap ${isOpen ? "is-open" : ""}`}
                  id={`acc-panel-${i}`}
                  role="region"
                  aria-labelledby={`acc-head-${i}`}
                >
                  <div className="acc-inner">
                    <p className="t-body acc-a">{r.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="answers-aside">
        <div className="askcard">
          <p className="t-headline askcard-head">Still have a question?</p>
          <Button variant="solid">Get a demo</Button>
          <Label tone="text-2" className="askcard-note">
            Typical reply under 2 hours
          </Label>
        </div>
      </aside>
    </section>
  );
}
