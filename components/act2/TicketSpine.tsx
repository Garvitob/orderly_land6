"use client";

import { Label } from "@/components/primitives/Label";

/**
 * §7 THE TICKET SPINE. The one idea the page is remembered for.
 *
 * §7.1 is a hard layout requirement and the reason this is written the way it
 * is: the spine occupies grid column 1 and is `position: sticky` INSIDE that
 * column, never `position: fixed`. Sticky inside the column means it
 * physically cannot escape and cannot clip a headline, which is what happened
 * in a previous build.
 *
 * Step 7 builds the strip and its first printed line, which is what the turn
 * needs. Growth and the remaining eleven print points land at step 11.
 */
export function TicketSpine() {
  return (
    <div className="spine-col" aria-hidden="true">
      <div className="spine-sticky">
        {/* scaleY 0 at rest; the turn feeds it in from the top like paper
            leaving a printer. transform-origin is top. */}
        <div className="spine-paper paper-scope" data-spine-paper>
          <div className="spine-perf" />
          <div className="spine-lines">
            <Label tone="text-2" className="spine-line" data-spine-line="0">
              <span>Table 12</span>
              <span>7:42</span>
            </Label>
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
  return (
    <div className="rail" aria-hidden="true">
      <div className="rail-fill" data-rail-fill />
    </div>
  );
}
