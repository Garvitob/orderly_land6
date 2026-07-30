"use client";

import { COPY } from "@/lib/copy";

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

      {/* The printer starts. This stub reuses Act III's own grid classes, so it
          lands at exactly the x of the real spine with no positioning maths to
          drift. Same width, same paper colour, same first line, so when the pin
          releases and Act III's spine takes over the cut is invisible. */}
      <div className="turn-spine-layer" aria-hidden="true">
        <div className="act3-grid">
          <div className="spine-col">
            <div className="spine-paper" data-turn-spine>
              <div className="spine-perf" />
              <div className="spine-lines">
                <p className="t-label spine-line">
                  <span>Table 12</span>
                  <span>7:42</span>
                </p>
              </div>
            </div>
          </div>
          <div />
        </div>
      </div>
    </>
  );
}
