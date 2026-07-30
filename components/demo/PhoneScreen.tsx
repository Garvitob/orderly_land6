"use client";

import { COPY } from "@/lib/copy";
import { Label } from "@/components/primitives/Label";
import { ModeTabs, type Mode } from "./ModeTabs";
import { MenuGrid } from "./MenuGrid";
import { CartStrip } from "./CartStrip";

/**
 * §8.4's screen: header, segmented control, the mode surface, a cart strip.
 *
 * The screen is the ONLY place on the page where sound is visualised (§5.1
 * bans ambient waveform wallpaper), and the only place iOS-style component
 * conventions are appropriate, which is why apple-design's component advice is
 * scoped to here and nowhere else.
 */
export function PhoneScreen({
  mode,
  onMode,
  cartCount,
  cartTotal,
  tapped,
  children,
}: {
  mode: Mode;
  onMode?: (m: Mode) => void;
  cartCount: number;
  cartTotal: number;
  tapped?: string;
  /** Chat and Voice surfaces are injected by the loop at step 9. */
  children?: React.ReactNode;
}) {
  return (
    <div className="pscreen">
      <header className="pscreen-head">
        <span className="pscreen-venue">{COPY.guest.venue}</span>
        <Label tone="text-2">{COPY.guest.table}</Label>
      </header>

      <ModeTabs mode={mode} onSelect={onMode} />

      <div className="pscreen-body">
        {mode === "menu" ? <MenuGrid tapped={tapped} /> : children}
      </div>

      <CartStrip count={cartCount} total={cartTotal} totalId="demo-total" />
    </div>
  );
}
