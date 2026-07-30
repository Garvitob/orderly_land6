"use client";

import { useEffect, useRef } from "react";
import type { Dish } from "@/lib/types";
import { DishCard } from "./DishCard";
import { VoiceBars } from "./VoiceBars";

export type Msg = {
  id: string;
  from: "guest" | "orderly";
  text: string;
  dishes?: readonly Dish[];
  flags?: Readonly<Record<string, string>>;
  chip?: string;
  addOn?: string;
  addPressed?: boolean;
};

/**
 * §8.4's conversation. Every guest and Orderly line is Instrument Serif italic,
 * which is what makes this read as two people talking rather than as UI. The
 * same components render the scripted loop and the live handoff, so there is
 * no second code path (§8.4).
 *
 * aria-live="polite" so a screen reader hears replies as they arrive.
 */
export function ChatThread({
  messages,
  typing,
  transcript,
  voiceLive,
  upsell,
}: {
  messages: readonly Msg[];
  typing?: boolean;
  transcript?: string;
  voiceLive?: boolean;
  upsell?: { text: string; visible: boolean };
}) {
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    // Auto-scroll to newest, 260ms, ease-out (§8.4).
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing, transcript]);

  return (
    <div className="thread" ref={scroller} aria-live="polite">
      {messages.map((m) => (
        <div key={m.id} className={`bubblewrap is-${m.from}`}>
          <p className={`bubble t-serif is-${m.from}`}>{m.text}</p>

          {m.dishes?.length ? (
            <div className="bubble-dishes">
              {m.dishes.map((d) => (
                <DishCard
                  key={d.id}
                  dish={d}
                  flag={m.flags?.[d.id]}
                  chip={m.chip}
                  showAdd={m.addOn === d.id}
                  pressed={m.addPressed}
                />
              ))}
            </div>
          ) : null}
        </div>
      ))}

      {typing ? (
        <div className="bubblewrap is-orderly">
          <span className="typing" aria-label="Orderly is typing">
            <i />
            <i />
            <i />
          </span>
        </div>
      ) : null}

      {/* The strip only exists while the mic is live. Once speech ends the line
          becomes an ordinary guest bubble, because that is what a transcript
          is. Left mounted, the idle bars collapsed to a 1.6px dashed rule that
          read as a broken element rather than a settled meter. */}
      {voiceLive ? (
        <div className="voiceblock">
          <VoiceBars live />
          {transcript ? <p className="transcript t-serif">{transcript}</p> : null}
        </div>
      ) : null}

      {upsell?.visible ? (
        <div className="upsell">
          <p className="upsell-text t-serif">{upsell.text}</p>
          <span className="upsell-add">Add</span>
        </div>
      ) : null}
    </div>
  );
}
