"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

const BARS = 26;
const STRIP_H = 20;

/**
 * §8.4's voice strip. 20px tall, INSIDE the phone screen only, because §5.1
 * bans ambient full-bleed waveform wallpaper.
 *
 * Driven by a speech-envelope state machine, not a sine wave: talk bursts of
 * 0.8 to 2.2s alternate with pauses of 0.35 to 0.9s, and inside a burst each
 * bar has its own smoothed target. A uniform sine is the tell the brief calls
 * out by name.
 *
 * Math.random only ever runs inside the rAF loop, never during render (§14.1).
 * Under reduced motion it paints exactly one static frame.
 */
export function VoiceBars({ live }: { live: boolean }) {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = el.clientWidth;
      el.width = Math.round(w * dpr);
      el.height = Math.round(STRIP_H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const values = new Float32Array(BARS);
    const targets = new Float32Array(BARS);

    /* Canvas cannot read a CSS variable, so the value is resolved here. The
       fallback chain stays inside the token system rather than repeating Ink as
       a literal, which §4.1 forbids outside the three token blocks. */
    const ink = () => {
      const cs = getComputedStyle(el);
      return (
        cs.getPropertyValue("--bar-color").trim() ||
        cs.getPropertyValue("--text").trim() ||
        cs.color
      );
    };

    const paint = () => {
      const w = el.clientWidth;
      const gap = 2;
      const bw = Math.max(1.5, (w - gap * (BARS - 1)) / BARS);
      ctx.clearRect(0, 0, w, STRIP_H);
      ctx.fillStyle = ink();
      for (let i = 0; i < BARS; i++) {
        const h = Math.max(1.5, values[i] * STRIP_H);
        const x = i * (bw + gap);
        ctx.fillRect(x, (STRIP_H - h) / 2, bw, h);
      }
    };

    if (prefersReducedMotion() || !live) {
      // One honest static frame: a settled envelope, not a flat line.
      for (let i = 0; i < BARS; i++) {
        const d = Math.abs(i - (BARS - 1) / 2) / ((BARS - 1) / 2);
        values[i] = live ? 0.22 + (1 - d) * 0.3 : 0.08;
      }
      paint();
      return;
    }

    /* speech envelope state machine */
    let phase: "talk" | "pause" = "talk";
    let phaseEnds = 0;
    let last = 0;
    let burstGain = 1;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const nextPhase = (now: number) => {
      if (phase === "talk") {
        phase = "pause";
        phaseEnds = now + rand(0.35, 0.9) * 1000;
      } else {
        phase = "talk";
        burstGain = rand(0.6, 1);
        phaseEnds = now + rand(0.8, 2.2) * 1000;
      }
    };

    const tick = (now: number) => {
      if (!last) {
        last = now;
        phaseEnds = now + rand(0.8, 2.2) * 1000;
      }
      const dt = Math.min(64, now - last) / 1000;
      last = now;

      if (now >= phaseEnds) nextPhase(now);

      for (let i = 0; i < BARS; i++) {
        if (phase === "talk") {
          // centre-weighted so the strip reads as a mouth, not a bar chart
          const d = Math.abs(i - (BARS - 1) / 2) / ((BARS - 1) / 2);
          const shape = 0.35 + (1 - d) * 0.65;
          if (Math.random() < 0.22) {
            targets[i] = rand(0.15, 1) * shape * burstGain;
          }
        } else if (Math.random() < 0.1) {
          targets[i] = rand(0.02, 0.09);
        }
        // asymmetric smoothing: attack fast, release slow, like a real meter
        const k = targets[i] > values[i] ? 14 : 6;
        values[i] += (targets[i] - values[i]) * Math.min(1, k * dt);
      }

      paint();
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, [live]);

  return (
    <canvas
      ref={canvas}
      className="voicebars"
      style={{ height: STRIP_H }}
      aria-hidden="true"
    />
  );
}
