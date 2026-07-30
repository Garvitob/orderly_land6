"use client";

/**
 * The demo's current beat, published so the ticket can print in step with it.
 *
 * §7 originally tied each ticket line to a SECTION, so the order built itself
 * across the whole page. The ticket is the order the demo is placing, so it
 * prints against the demo's own beats instead: the line and the thing it
 * records now happen at the same moment, which is the only way the strip reads
 * as a printer attached to that phone rather than a page progress bar.
 *
 * A module store rather than context: Guest owns the loop and TicketSpine is
 * not inside it, and this is one number changing eight times.
 */
let current = -1;
const listeners = new Set<(beat: number) => void>();

export function setDemoBeat(beat: number): void {
  if (beat === current) return;
  current = beat;
  listeners.forEach((l) => l(beat));
}

export function getDemoBeat(): number {
  return current;
}

export function onDemoBeat(cb: (beat: number) => void): () => void {
  listeners.add(cb);
  cb(current);
  return () => {
    listeners.delete(cb);
  };
}
