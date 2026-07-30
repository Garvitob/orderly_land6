import type { TicketLine } from "./types";

/**
 * §7's ticket, set for the real strip width.
 *
 * DEVIATION, reported: §7 specifies a 48px strip and §7.1 a 96px column. The
 * client asked for a ticket that reads as a real one on the demo screen, so the
 * column is 132px and the paper 116px. That width is what lets the dish names
 * be the dish names instead of `1× BUTTER CHKN`: at 11px Label with tracking,
 * a 48px strip left 34px of usable width and forced abbreviation.
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
  { id: "i1", beat: 0, left: "1× Smash Burger", kind: "item" },
  { id: "asked", beat: 1, left: "Asked", right: "✓" },
  { id: "i2", beat: 2, left: "1× Mac & Cheese", kind: "item" },
  { id: "i2m", beat: 2, left: "› mild", kind: "mod" },
  { id: "i3", beat: 3, left: "1× Vanilla Shake", kind: "item" },
  { id: "i4", beat: 4, left: "1× Garlic Fries", kind: "item" },
  { id: "rule-2", beat: 5, left: "", kind: "rule" },
  { id: "paid", beat: 5, left: "Paid", right: "32.45", kind: "total" },
  { id: "routed", beat: 6, left: "Toast", right: "✓" },
  { id: "fired", beat: 7, left: "Fired", right: "✓" },
] as const;

/** The print points that are real lines, for the mobile rail's tick marks. */
export const PRINT_POINTS = TICKET.filter((l) => l.kind !== "rule");
