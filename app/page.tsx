import { Nav } from "@/components/chrome/Nav";
import { Room } from "@/components/act1/Room";

/** Composition only, zero logic (§13). */
export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Room />
        {/* Act III lands at step 7 onward. This placeholder exists so the pin
            has somewhere to release into and can be verified now. */}
        <section
          id="guest"
          style={{
            minHeight: "160vh",
            background: "var(--surface)",
            paddingBlock: "var(--sp-breathe)",
          }}
        >
          <div className="shell">
            <p className="t-label" style={{ color: "var(--text-2)" }}>
              Act III lands at step 7
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
