"use client";

import { useEffect, useRef } from "react";
import { gsap, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { COPY } from "@/lib/copy";
import { dish, money } from "@/lib/menu";
import { Label } from "@/components/primitives/Label";
import { Phone } from "@/components/demo/Phone";
import { PhoneScreen } from "@/components/demo/PhoneScreen";
import { DemoCaption } from "@/components/demo/DemoCaption";

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

/**
 * §8.4 THE GUEST. Answers: show me. What does my guest actually do?
 *
 * This comes first in Act III because the fastest way to explain the product is
 * to run it. Asymmetric on purpose: copy left, phone right at roughly 44% and
 * rotated -3deg, and the phone overlaps the section boundary below by ~70px so
 * the two sections physically interlock instead of stacking.
 *
 * Step 8 builds the chrome, the screen, the tabs and the caption line. The
 * 22-second auto-loop lands at step 9 and the interactive handoff at step 10.
 */
export function Guest() {
  const root = useRef<HTMLElement | null>(null);
  const phone = useRef<HTMLDivElement | null>(null);

  const first = dish("butter-chicken");

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
          scrollTrigger: {
            trigger: rootEl,
            start: "top 78%",
            once: true, // never re-fires on scroll-up (§10.2)
          },
        },
      );
    }, rootEl);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section id="guest" ref={root} className="sec guest">
      <div className="guest-copy">
        <Label tone="text-2">{COPY.guest.label}</Label>
        <h2 className="t-headline sec-head">{COPY.guest.headline}</h2>
        <p className="t-body sec-sub">{COPY.guest.subhead}</p>
      </div>

      <div className="guest-phone">
        <div ref={phone} className="guest-phone-inner">
          <Phone>
            <PhoneScreen
              mode="menu"
              cartCount={1}
              cartTotal={first ? first.price : 0}
              tapped="butter-chicken"
            />
          </Phone>
        </div>

        {/* §6.3. Directly beneath the phone. Not optional. */}
        <DemoCaption captions={CAPTIONS} active={0} />
        <span className="sr-only">
          Demo cart total {money(first ? first.price : 0)}
        </span>
      </div>
    </section>
  );
}
