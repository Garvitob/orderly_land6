import { Nav } from "@/components/chrome/Nav";
import { Room } from "@/components/act1/Room";

/** Composition only, zero logic (§13). */
export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Room />
      </main>
    </>
  );
}
