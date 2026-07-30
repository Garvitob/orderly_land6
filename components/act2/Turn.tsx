"use client";

import { COPY } from "@/lib/copy";
import { TICKET } from "@/lib/ticket";

/** Every line but the head is present for geometry only, never painted. */
const HIDDEN = { opacity: 0 } as const;

/**
 * §8.3 THE TURN. The most important 20% of scroll on the page.
 *
 * These three layers live inside Act I's pinned section so they are pinned
 * with it and the whole turn is one scrubbed timeline (Room owns it):
 *
 *   1. `.turn-dark`  the room goes dark. An --act1-bg plate above the video.
 *   2. `.turn-card`  Scan, speak, done. The only centred display type on the
 *                    page, because it is a title card.
 *   3. `.turn-paper` Act III's surface wipes UP from the bottom edge via
 *                    clipPath inset. A wipe, like a page being laid down.
 *                    Never a fade.
 *
 * Stacking order is deliberate: the paper sits ABOVE the card. The card is Oat
 * type, so the instant paper is behind it the card would vanish into its own
 * background. Paper on top means the card stays on the darkening plate for its
 * entire visible life, exactly as §8.3 describes, and the paper is what ends
 * Act I by consuming it.
 */
export function Turn() {
  return (
    <>
      <div className="turn-dark" data-turn-dark aria-hidden="true" />

      <div className="turn-card" data-turn-card>
        <p className="t-display turn-card-line">{COPY.turn.titleCard}</p>
      </div>

      <div className="turn-paper" data-turn-paper aria-hidden="true" />

      {/* The printer starts. This stub reuses Act III's own grid classes so it
          lands at exactly the x of the real spine with no positioning maths to
          drift, and it renders the WHOLE ticket with only the head line visible.
          That last part matters: the real sheet distributes its lines down the
          full height, so a stub holding one line put its "Table 12" at a
          different y and the wipe showed two of them, offset, mid transition.
          Identical markup means identical geometry, and the cut is invisible. */}
      <div className="turn-spine-layer" aria-hidden="true">
        <div className="act3-grid">
          <div className="spine-col">
            <div className="spine-paper paper-scope" data-turn-spine>
              <div className="spine-perf" />
              <div className="spine-lines">
                <p className="spine-dots">· · · · · ·</p>

                {TICKET.map((l) =>
                  l.kind === "rule" ? (
                    <span key={l.id} className="spine-hr" style={HIDDEN} />
                  ) : (
                    <p
                      key={l.id}
                      className={`t-label spine-line is-${l.kind ?? "row"}`}
                      style={l.id === "head" ? undefined : HIDDEN}
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
          <div />
        </div>
      </div>
    </>
  );
}
