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
 * `at` names the section whose onEnter prints the line, so the ticket and the
 * page cannot drift apart: if a section is not on the page, its line does not
 * print.
 */
export const TICKET: readonly (TicketLine & { at: string })[] = [
  { id: "head", at: "guest", left: "Table 12", right: "7:42" },
  { id: "rule-1", at: "guest", left: "", kind: "rule" },
  { id: "scan", at: "guest", left: "Scan", right: "✓" },
  { id: "asked", at: "wearenot", left: "Asked", right: "✓" },
  { id: "i1", at: "modes", left: "1× smash", kind: "item" },
  { id: "i1m", at: "modes", left: "› mild", kind: "mod" },
  { id: "i2", at: "numbers", left: "1× mac", kind: "item" },
  { id: "i3", at: "break", left: "1× shake", kind: "item" },
  { id: "i4", at: "journey", left: "1× fries", kind: "item" },
  { id: "rule-2", at: "value", left: "", kind: "rule" },
  { id: "paid", at: "answers", left: "Paid", right: "32.45", kind: "total" },
  { id: "routed", at: "quotes", left: "Toast", right: "✓" },
  { id: "fired", at: "close", left: "Fired", right: "✓" },
] as const;

/** The print points that are real lines, for the mobile rail's tick marks. */
export const PRINT_POINTS = TICKET.filter((l) => l.kind !== "rule");
