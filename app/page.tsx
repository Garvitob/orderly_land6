import { ThemeToggle } from "@/components/chrome/ThemeToggle";

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

      <div style={{ height: "80vh" }} aria-hidden="true" />
    </main>
  );
}
