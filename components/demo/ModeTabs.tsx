"use client";

import { cn } from "@/lib/cn";

export type Mode = "menu" | "chat" | "voice";

/**
 * The segmented control. `Chat` is the literal name of the product mode, which
 * is the one sanctioned exception to the kit's say-conversation-not-chat rule
 * (§5.3). Flagged in the report.
 *
 * Tabs are Hanken, never Instrument Serif: this is interface, not a person
 * speaking. The active pill travels rather than cross-fading.
 */
const MODES: readonly { id: Mode; label: string }[] = [
  { id: "menu", label: "Menu" },
  { id: "chat", label: "Chat" },
  { id: "voice", label: "Voice" },
];

export function ModeTabs({
  mode,
  onSelect,
}: {
  mode: Mode;
  onSelect?: (m: Mode) => void;
}) {
  const index = MODES.findIndex((m) => m.id === mode);

  return (
    <div className="modetabs" role="tablist" aria-label="Ordering mode">
      <span
        className="modetabs-knob"
        aria-hidden="true"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          role="tab"
          aria-selected={m.id === mode}
          tabIndex={m.id === mode ? 0 : -1}
          className={cn("modetabs-tab", m.id === mode && "is-active")}
          onClick={onSelect ? () => onSelect(m.id) : undefined}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
