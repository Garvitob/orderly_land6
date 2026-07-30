import { Label } from "@/components/primitives/Label";
import { COPY } from "@/lib/copy";

/**
 * §8.2's scroll cue. A 1px vertical rule 28px tall with a 6px segment
 * travelling down it on a 1.8s loop, plus SCROLL in Label at 60%.
 *
 * The travel is a CSS animation rather than a GSAP tween: it is ambient,
 * predetermined, and never interrupted, so it belongs off the main thread
 * (Emil, and §10.3's transform-only rule holds either way). `.anim-loop` is
 * what prefers-reduced-motion switches off.
 *
 * Bottom centre is deliberate and is not a §5.1 "everything centred" breach:
 * the cue and the turn's title card are the only centred elements on the page.
 */
export function ScrollCue() {
  return (
    <div className="scrollcue" aria-hidden="true">
      <span className="scrollcue-track">
        <span className="scrollcue-seg anim-loop" />
      </span>
      <Label tone="text-2" className="scrollcue-lab">
        {COPY.act1.scrollCue}
      </Label>
    </div>
  );
}
