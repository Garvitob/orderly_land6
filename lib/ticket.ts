import type { TicketLine } from "./types";

/**
 * §7's ticket, set for the real strip width.
 *
 * DEVIATION, reported: §7 specifies both a 48px strip and lines like
 * `1× BUTTER CHKN` at 11px Label style. Those cannot both hold: 14 characters
 * of 11px Hanken with tracking needs about 90px, and a 48px strip leaves 34px
 * of usable width. Rather than shrink the type below the §7 floor or let the
 * text wrap mid-phrase, the paper is 84px inside §7.1's 96px column and the
 * item names are abbreviated the way a real kitchen ticket abbreviates them.
 *
 * `beat` is the §6.3 demo beat that prints the line. The ticket IS the order the
 * demo is placing, so the two are driven by one clock: the line and the thing it
 * records happen at the same moment. It used to key off page SECTIONS, which
 * spread one order across the whole document and printed PAID three screens
 * after the phone had taken payment.
 */
export const TICKET: readonly (TicketLine & { beat: number })[] = [
  { id: "head", beat: 0, left: "Table 12", right: "7:42" },
  { id: "rule-1", beat: 0, left: "", kind: "rule" },
  { id: "scan", beat: 0, left: "Scan", right: "✓" },
  { id: "i1", beat: 0, left: "1× smash", kind: "item" },
  { id: "asked", beat: 1, left: "Asked", right: "✓" },
  { id: "i2", beat: 2, left: "1× mac", kind: "item" },
  { id: "i2m", beat: 2, left: "› mild", kind: "mod" },
  { id: "i3", beat: 3, left: "1× shake", kind: "item" },
  { id: "i4", beat: 4, left: "1× fries", kind: "item" },
  { id: "rule-2", beat: 5, left: "", kind: "rule" },
  { id: "paid", beat: 5, left: "Paid", right: "32.45", kind: "total" },
  { id: "routed", beat: 6, left: "Toast", right: "✓" },
  { id: "fired", beat: 7, left: "Fired", right: "✓" },
] as const;

/** The print points that are real lines, for the mobile rail's tick marks. */
export const PRINT_POINTS = TICKET.filter((l) => l.kind !== "rule");
