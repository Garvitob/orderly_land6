"use client";

import { COPY } from "@/lib/copy";
import { Label } from "@/components/primitives/Label";
import { ModeTabs, type Mode } from "./ModeTabs";
import { MenuGrid } from "./MenuGrid";
import { CartStrip } from "./CartStrip";
import { ChatThread, type Msg } from "./ChatThread";
import { PaySheet, type PayState } from "./PaySheet";
import { RouteStamp } from "./RouteStamp";
import { ChatInput } from "./ChatInput";

/**
 * §8.4's screen: header, segmented control, the mode surface, a cart strip.
 *
 * This is the only place on the page where sound is visualised (§5.1 bans
 * ambient waveform wallpaper) and the only place iOS-style component
 * conventions are appropriate, which is why apple-design's component advice is
 * scoped here and nowhere else.
 */
export function PhoneScreen({
  mode,
  onMode,
  cartCount,
  cartTotal,
  tapped,
  messages,
  typing,
  transcript,
  voiceLive,
  upsell,
  pay,
  routed,
  handoff,
  onSend,
}: {
  mode: Mode;
  onMode?: (m: Mode) => void;
  cartCount: number;
  cartTotal: number;
  tapped?: string | null;
  messages: readonly Msg[];
  typing?: boolean;
  transcript?: string;
  voiceLive?: boolean;
  upsell?: { text: string; visible: boolean };
  pay: PayState;
  routed?: boolean;
  handoff?: boolean;
  onSend?: (text: string) => void;
}) {
  return (
    <div className="pscreen">
      <header className="pscreen-head">
        <span className="pscreen-venue">{COPY.guest.venue}</span>
        <Label tone="text-2">{COPY.guest.table}</Label>
      </header>

      <ModeTabs mode={mode} onSelect={onMode} />

      <div className="pscreen-body">
        {mode === "menu" ? (
          <MenuGrid tapped={tapped ?? undefined} />
        ) : (
          <ChatThread
            messages={messages}
            typing={typing}
            transcript={transcript}
            voiceLive={voiceLive}
            upsell={upsell}
          />
        )}

        <PaySheet state={pay} total={cartTotal} />
        {routed ? <RouteStamp /> : null}
      </div>

      {/* The cart never disappears: the order has been placed and the total is
          the operator's proof. The input activates alongside it at handoff. */}
      <CartStrip count={cartCount} total={cartTotal} totalId="demo-total" />
      {handoff && onSend ? <ChatInput onSend={onSend} /> : null}
    </div>
  );
}
