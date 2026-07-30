import { Nav } from "@/components/chrome/Nav";
import { Room } from "@/components/act1/Room";
import { TicketSpine, TicketSpineMobile } from "@/components/act2/TicketSpine";
import { TryLivePill } from "@/components/chrome/TryLivePill";
import { Guest } from "@/components/sections/Guest";
import { WeAreNot } from "@/components/sections/WeAreNot";
import { Modes } from "@/components/sections/Modes";
import { Numbers } from "@/components/sections/Numbers";
import { VideoBreak } from "@/components/sections/VideoBreak";
import { Journey } from "@/components/sections/Journey";
import { Value } from "@/components/sections/Value";
import { Answers } from "@/components/sections/Answers";
import { Quotes } from "@/components/sections/Quotes";
import { Next } from "@/components/sections/Next";
import { LastCall } from "@/components/sections/LastCall";
import { Close } from "@/components/sections/Close";

/** Composition only, zero logic (§13). */
export default function Page() {
  return (
    <>
      <Nav />
      <main>
        {/* ACT I + ACT II. One pin, 130vh. */}
        <Room />

        {/* ACT III. The spine holds column 1 for the whole act and every
            section lives in column 2, never reaching back with negative
            margins (§7.1). */}
        <div className="act3">
          <div className="act3-grid">
            <TicketSpine />
            <div className="act3-content">
              <Guest />
              <WeAreNot />
              <Modes />
              <Numbers />
              <VideoBreak />
              <Journey />
              <Value />
              <Answers />
              <Quotes />
              <Next />
              <LastCall />
              <Close />
            </div>
          </div>
        </div>

        <TicketSpineMobile />
        <TryLivePill />
      </main>
    </>
  );
}
