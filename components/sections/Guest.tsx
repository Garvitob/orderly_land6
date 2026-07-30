"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { useInView } from "@/lib/useInView";
import { COPY } from "@/lib/copy";
import { money } from "@/lib/menu";
import { Label } from "@/components/primitives/Label";
import { TextLink } from "@/components/primitives/Button";
import { Phone } from "@/components/demo/Phone";
import { PhoneScreen } from "@/components/demo/PhoneScreen";
import { DemoCaption } from "@/components/demo/DemoCaption";
import { useDemoLoop } from "@/components/demo/useDemoLoop";

const CAPTIONS = [
  COPY.captions.menu,
  COPY.captions.conversation1,
  COPY.captions.conversation2,
  COPY.captions.voice,
  COPY.captions.upsell,
  COPY.captions.pay,
  COPY.captions.route,
  COPY.captions.handoff,
] as const;

const UPSELL_TEXT = "Garlic naan with that? It goes with the butter chicken.";

/**
 * §8.4 THE GUEST. Answers: show me. What does my guest actually do?
 *
 * First in Act III because the fastest way to explain the product is to run it.
 * Asymmetric: copy left, phone right at roughly 44% rotated -3deg, overlapping
 * the section below by ~70px so the two interlock rather than stack.
 *
 * The loop only starts once the phone is actually on screen, so a reader never
 * arrives at a demo that already finished without them.
 */
export function Guest() {
  const root = useRef<HTMLElement | null>(null);
  const phone = useRef<HTMLDivElement | null>(null);
  const inView = useInView(phone);

  const { state, dispatch, total, takeOver } = useDemoLoop(inView);

  useEffect(() => {
    initGsap();
    const rootEl = root.current;
    const phoneEl = phone.current;
    if (!rootEl || !phoneEl) return;

    if (prefersReducedMotion()) {
      gsap.set(phoneEl, { y: 0, rotate: -3, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        phoneEl,
        { y: 80, rotate: -8, opacity: 0 },
        {
          y: 0,
          rotate: -3,
          opacity: 1,
          duration: 0.95,
          ease: "shift",
          scrollTrigger: { trigger: rootEl, start: "top 78%", once: true },
        },
      );
    }, rootEl);

    return () => {
      ctx.revert();
    };
  }, []);

  // Step 9 appends the guest line only. The brain's reply lands at step 10.
  const handleSend = (text: string) => {
    takeOver();
    dispatch({
      type: "msg",
      msg: { id: `u${Date.now()}`, from: "guest", text },
    });
  };

  return (
    <section id="guest" ref={root} className="sec guest">
      <div className="guest-copy">
        <Label tone="text-2">{COPY.guest.label}</Label>
        <h2 className="t-headline sec-head">{COPY.guest.headline}</h2>
        <p className="t-body sec-sub">{COPY.guest.subhead}</p>

        {/* §6.5: one text link or one button, never both. The phone is the
            proof, so this is the link, and it points at where the order goes,
            which is the next question an operator asks. */}
        <TextLink href="#journey" className="sec-link">
          See where the order goes
        </TextLink>
      </div>

      <div className="guest-phone">
        <div ref={phone} className="guest-phone-inner">
          <Phone>
            <PhoneScreen
              mode={state.mode}
              cartCount={state.cart.length}
              cartTotal={total}
              tapped={state.tapped}
              messages={state.messages}
              typing={state.typing}
              transcript={state.transcript}
              voiceLive={state.voiceLive}
              upsell={{ text: UPSELL_TEXT, visible: state.upsellVisible }}
              pay={state.pay}
              routed={state.routed}
              handoff={state.handoff}
              onSend={handleSend}
            />
          </Phone>
        </div>

        {/* §6.3. Directly beneath the phone. Not optional. */}
        <DemoCaption captions={CAPTIONS} active={state.beat} />

        {/* Nothing important lives only inside an animation (§6.4). */}
        <span className="sr-only">
          Demo order total {money(total)}, {state.cart.length} items,
          {state.routed ? " sent to Toast" : " in progress"}.
        </span>
      </div>
    </section>
  );
}
