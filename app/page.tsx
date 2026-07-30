import { Nav } from "@/components/chrome/Nav";
import { Room } from "@/components/act1/Room";
import { TicketSpine, TicketSpineMobile } from "@/components/act2/TicketSpine";
import { Guest } from "@/components/sections/Guest";

/** Composition only, zero logic (§13). */
export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Room />

        {/* ACT III. The spine holds column 1 for the whole act and every
            section lives in column 2, never reaching back with negative
            margins (§7.1). */}
        <div className="act3">
          <div className="act3-grid">
            <TicketSpine />
            <div className="act3-content">
              <Guest />
              {/* §8.5 onward land at step 12. */}
              <section className="sec">
                <p className="t-label" style={{ color: "var(--text-2)" }}>
                  §8.5 onward land at step 12
                </p>
                <div style={{ height: "120vh" }} />
              </section>
            </div>
          </div>
        </div>

        <TicketSpineMobile />
      </main>
    </>
  );
}
