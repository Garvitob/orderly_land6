import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { MotionPathSmoke } from "@/components/dev/MotionPathSmoke";
import { Mark } from "@/components/chrome/Mark";
import { Label } from "@/components/primitives/Label";
import { Button, TextLink } from "@/components/primitives/Button";
import { Figure } from "@/components/primitives/Figure";
import { Ticket } from "@/components/primitives/Ticket";
import { Pip } from "@/components/primitives/Pip";
import { PhotoSlot } from "@/components/primitives/PhotoSlot";

/**
 * STEP 1 SPECIMEN. Temporary. This exists only to verify the §4.1 tokens,
 * the §4.4 two-family scale and the §4.3 toggle before Act I is built at
 * step 4. It gets replaced wholesale, not extended.
 */
const SCALE = [
  { cls: "t-act1-display", name: "ACT1-DISPLAY", spec: "800 · −0.03em · 1.06" },
  { cls: "t-display", name: "DISPLAY", spec: "800 · −0.03em · 1.06" },
  { cls: "t-headline", name: "HEADLINE", spec: "700 · −0.02em · 1.19" },
  { cls: "t-subhead", name: "SUBHEAD", spec: "600 · 1.40" },
  { cls: "t-body", name: "BODY", spec: "400 · 16 / 1.625 · max 62ch" },
  { cls: "t-label", name: "LABEL", spec: "600 · 12 · +0.14em · caps" },
  { cls: "t-figure", name: "FIGURE", spec: "800 · −0.03em · 0.92 · tabular" },
] as const;

const SWATCHES = [
  { v: "var(--surface)", n: "surface" },
  { v: "var(--surface-2)", n: "surface-2" },
  { v: "var(--text)", n: "text" },
  { v: "var(--text-2)", n: "text-2" },
  { v: "var(--orange)", n: "orange" },
  { v: "var(--peach)", n: "peach" },
  { v: "var(--basil)", n: "basil" },
  { v: "var(--act1-bg)", n: "act1-bg" },
] as const;

export default function Page() {
  return (
    <main className="shell" style={{ paddingBlock: "var(--sp-tight)" }}>
      <header
        className="flex items-center justify-between"
        style={{ paddingBottom: "var(--sp-tight)" }}
      >
        <span className="t-label" style={{ color: "var(--text-2)" }}>
          Step 1 · foundation
        </span>
        <ThemeToggle />
      </header>

      <hr className="rule" />

      <section style={{ paddingBlock: "var(--sp-tight)" }}>
        <p className="t-label" style={{ color: "var(--orange)" }}>
          Two voices, one system
        </p>
        <div style={{ height: 20 }} />
        {SCALE.map((s) => (
          <div
            key={s.name}
            style={{
              display: "grid",
              gap: 6,
              paddingBlock: 18,
              borderTop: "1px solid var(--rule)",
            }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="t-label" style={{ color: "var(--text-2)" }}>
                {s.name}
              </span>
              <span className="t-label" style={{ color: "var(--text-2)" }}>
                {s.spec}
              </span>
            </div>
            <p className={s.cls}>
              {s.cls === "t-label"
                ? "Table 12 · 7:42 · paid 32.45"
                : "Scan, speak, done."}
            </p>
          </div>
        ))}

        <div
          style={{
            paddingBlock: 18,
            borderTop: "1px solid var(--rule)",
            display: "grid",
            gap: 6,
          }}
        >
          <div className="flex items-baseline justify-between gap-4">
            <span className="t-label" style={{ color: "var(--text-2)" }}>
              Overheard
            </span>
            <span className="t-label" style={{ color: "var(--text-2)" }}>
              Instrument Serif italic · quotes only
            </span>
          </div>
          <p
            className="t-overheard pull-optical"
            style={{ color: "var(--text-2)" }}
          >
            &ldquo;Something spicy, but not too heavy. What do you have?&rdquo;
          </p>
        </div>
      </section>

      <hr className="rule" />

      <section style={{ paddingBlock: "var(--sp-tight)" }}>
        <p className="t-label" style={{ color: "var(--text-2)" }}>
          Tokens
        </p>
        <div style={{ height: 16 }} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 1,
            background: "var(--rule)",
            border: "1px solid var(--rule)",
          }}
        >
          {SWATCHES.map((s) => (
            <div key={s.n} style={{ background: "var(--surface)" }}>
              <div style={{ background: s.v, height: 64 }} />
              <p
                className="t-label"
                style={{ padding: "8px 10px", color: "var(--text-2)" }}
              >
                {s.n}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="rule" />

      <section style={{ paddingBlock: "var(--sp-tight)" }}>
        <Label tone="text-2">Step 3 · primitives</Label>
        <div style={{ height: 24 }} />

        {/* The mark, one colour, three grounds. Exactly as the kit's Logo page. */}
        <div
          style={{
            display: "flex",
            gap: 1,
            background: "var(--rule)",
            width: "fit-content",
          }}
        >
          <div style={{ background: "var(--surface-2)", padding: 28, color: "var(--orange)" }}>
            <Mark size={44} title="Orderly" />
          </div>
          <div style={{ background: "var(--orange)", padding: 28, color: "var(--white)" }}>
            <Mark size={44} />
          </div>
          <div style={{ background: "var(--ink)", padding: 28, color: "var(--oat)" }}>
            <Mark size={44} />
          </div>
          <div style={{ background: "var(--surface-2)", padding: 28, color: "var(--orange)", display: "grid", placeItems: "center" }}>
            <Mark size={24} />
          </div>
        </div>

        <div style={{ height: 28 }} />

        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <Button variant="solid">Get a demo</Button>
          <Button variant="ink">Try it live</Button>
          <Button variant="outline">Toast</Button>
          <TextLink href="#see">See how it works</TextLink>
          <Button variant="solid" disabled>
            Sending
          </Button>
        </div>

        <div style={{ height: 28 }} />

        <div style={{ display: "flex", gap: 34, alignItems: "flex-start", flexWrap: "wrap" }}>
          <Figure value="+23%" caption="average order value with conversational ordering" accent />
          <Figure value="2.4x" caption="faster than a counter" />
          <Figure value="0" caption="apps to download" />
        </div>

        <div style={{ height: 28 }} />

        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          <Ticket axis="y" shadow style={{ width: 208, padding: "16px 18px" }}>
            <Label tone="text-2">Table 12</Label>
            <div style={{ height: 8 }} />
            <Label tone="text">1× butter chkn</Label>
            <Label tone="text-2">› mild</Label>
            <div style={{ height: 8 }} />
            <Label tone="text">paid 32.45</Label>
          </Ticket>

          <Ticket axis="x" style={{ width: 48, height: 168 }} />

          <div style={{ display: "flex", gap: 10, alignItems: "center", paddingTop: 6 }}>
            <Pip />
            <Pip tone="orange" />
            <Pip tone="basil" />
            <Label tone="text-2">table state</Label>
          </div>

          <div style={{ width: 220 }}>
            <PhotoSlot ratio="4 / 3" name="Room at service" dimensions="1600 × 1200" />
          </div>
        </div>
      </section>

      <hr className="rule" />

      <MotionPathSmoke />

      <div style={{ height: "60vh" }} aria-hidden="true" />
    </main>
  );
}
