"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMediaQuery, NARROW } from "@/lib/useMediaQuery";

/**
 * §3.2, to the letter.
 *
 * - `muted` and `playsInline` are mandatory or iOS refuses to autoplay.
 * - Never the `autoPlay` prop: .play() is called in an effect and the
 *   rejection is swallowed, because an unhandled rejection fails §14.
 * - `preload="metadata"`, never auto. The poster covers the gap.
 * - Under prefers-reduced-motion the video element is never mounted at all.
 * - Under 900px only hero-mobile.webm is served.
 * - The blur is baked into the file. `filter` is never animated here.
 * - IntersectionObserver pauses it the moment Act I leaves the viewport.
 * - onError keeps the poster and lets the page continue (§3.3). Act I is
 *   fully readable with no video at all.
 */
export function HeroVideo({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  const reduced = useReducedMotion();
  const narrow = useMediaQuery(NARROW);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (reduced || failed) return;
    const el = videoRef.current;
    if (!el) return;

    void el.play().catch(() => {});

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void el.play().catch(() => {});
          } else {
            el.pause();
          }
        }
      },
      { threshold: 0.01 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      el.pause();
    };
  }, [reduced, failed, videoRef, narrow]);

  if (reduced || failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="room-media"
        src="/video/hero-poster.jpg"
        alt=""
        aria-hidden="true"
      />
    );
  }

  return (
    <video
      key={narrow ? "narrow" : "wide"}
      ref={videoRef}
      className="room-media"
      poster="/video/hero-poster.jpg"
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      onError={() => setFailed(true)}
    >
      {narrow ? (
        <source src="/video/hero-mobile.webm" type="video/webm" />
      ) : (
        <>
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </>
      )}
    </video>
  );
}
