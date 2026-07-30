"use client";

import { useEffect, useMemo, useReducer, useRef } from "react";
import { gsap, ScrollTrigger, initGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { dish } from "@/lib/menu";
import type { Mode } from "./ModeTabs";
import type { Msg } from "./ChatThread";
import type { PayState } from "./PaySheet";

export type DemoState = {
  /** Index into §6.3's eight captions. The caption IS the beat. */
  beat: number;
  mode: Mode;
  messages: Msg[];
  cart: string[];
  tapped: string | null;
  typing: boolean;
  transcript: string;
  voiceLive: boolean;
  upsellVisible: boolean;
  pay: PayState;
  routed: boolean;
  handoff: boolean;
};

const INITIAL: DemoState = {
  beat: 0,
  mode: "menu",
  messages: [],
  cart: [],
  tapped: null,
  typing: false,
  transcript: "",
  voiceLive: false,
  upsellVisible: false,
  pay: "hidden",
  routed: false,
  handoff: false,
};

const VOICE_LINE = "and a vanilla shake";

/** The scripted conversation, shared by the loop and by the reduced-motion
 *  completed state so there is only one source of truth for what was said. */
function scriptMessages(): Msg[] {
  const bc = dish("smash-burger");
  const rj = dish("nashville-hot");
  const mk = dish("mac-and-cheese");
  return [
    { id: "g1", from: "guest", text: "what are your best sellers?" },
    {
      id: "o1",
      from: "orderly",
      text: "The smash burger goes out more than anything else on the menu. The Nashville hot if you want heat.",
      dishes: [bc, rj].filter((d): d is NonNullable<typeof d> => Boolean(d)),
      flags: { "smash-burger": "Most ordered" },
    },
    { id: "g2", from: "guest", text: "something mildly spiced for my mom" },
    {
      id: "o2",
      from: "orderly",
      text: "The mac and cheese has no heat at all. Three cheeses, very gentle.",
      dishes: mk ? [mk] : [],
      chip: "Mild",
    },
    { id: "g3", from: "guest", text: VOICE_LINE },
  ];
}

/** The completed state, for §10.4's reduced-motion path. A reader with reduced
 *  motion gets the whole conversation, not an empty screen. */
const FINISHED: DemoState = {
  beat: 7,
  mode: "chat",
  messages: [],
  cart: ["smash-burger", "mac-and-cheese", "vanilla-shake", "garlic-fries"],
  tapped: null,
  typing: false,
  transcript: "",
  voiceLive: false,
  upsellVisible: false,
  pay: "paid",
  routed: true,
  handoff: true,
};

type Action =
  | { type: "patch"; patch: Partial<DemoState> }
  | { type: "msg"; msg: Msg }
  | { type: "patchLastMsg"; patch: Partial<Msg> }
  | { type: "add"; id: string }
  | { type: "reset" }
  | { type: "finish" };

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case "patch":
      return { ...state, ...action.patch };
    case "msg":
      return { ...state, messages: [...state.messages, action.msg] };
    case "patchLastMsg": {
      if (!state.messages.length) return state;
      const messages = state.messages.slice();
      messages[messages.length - 1] = {
        ...messages[messages.length - 1],
        ...action.patch,
      };
      return { ...state, messages };
    }
    case "add":
      return state.cart.includes(action.id)
        ? state
        : { ...state, cart: [...state.cart, action.id] };
    case "reset":
      // A fresh object every time, so nothing accumulates across loops (§15).
      return { ...INITIAL, messages: [] };
    case "finish":
      return { ...FINISHED, messages: scriptMessages() };
  }
}

export const CART_IDS = [
  "smash-burger",
  "mac-and-cheese",
  "vanilla-shake",
  "garlic-fries",
] as const;

/**
 * §8.4's 22-second auto-loop. GSAP owns time, React owns render: every beat is
 * a `.call()` on one timeline, so the whole sequence is inspectable, seekable
 * and killable from one place. No `setTimeout` chains.
 *
 * The loop repeats with a 5s hold on the handoff beat so a returning reader
 * sees it alive, and it stops permanently the moment the reader types, which is
 * what "then it hands control over" means. `onRepeat` dispatches a full reset
 * so state cannot accumulate (§15).
 */
export function useDemoLoop(active: boolean) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const stopped = useRef(false);

  useEffect(() => {
    if (!active) return;
    initGsap();

    if (prefersReducedMotion()) {
      // §10.4: show the completed state. No timeline at all.
      dispatch({ type: "finish" });
      return;
    }

    const p = (patch: Partial<DemoState>) => () =>
      dispatch({ type: "patch", patch });

    const t = gsap.timeline({
      repeat: -1,
      repeatDelay: 5,
      onRepeat: () => dispatch({ type: "reset" }),
    });

    /* ── MENU · 2.5s ─────────────────────────────────────────────── */
    t.call(p({ tapped: "smash-burger" }), undefined, 0.9);
    t.call(() => {
      dispatch({ type: "patch", patch: { tapped: null } });
      dispatch({ type: "add", id: "smash-burger" });
    }, undefined, 1.2);

    /* ── CONVERSATION · 9s ───────────────────────────────────────── */
    t.call(p({ beat: 1, mode: "chat" }), undefined, 2.5);
    t.call(() => {
      dispatch({
        type: "msg",
        msg: { id: "g1", from: "guest", text: "what are your best sellers?" },
      });
    }, undefined, 2.7);
    t.call(p({ typing: true }), undefined, 3.3);
    t.call(() => {
      dispatch({ type: "patch", patch: { typing: false } });
      const bc = dish("smash-burger");
      const rj = dish("nashville-hot");
      dispatch({
        type: "msg",
        msg: {
          id: "o1",
          from: "orderly",
          text: "The smash burger goes out more than anything else on the menu. The Nashville hot if you want heat.",
          dishes: [bc, rj].filter((d): d is NonNullable<typeof d> => Boolean(d)),
          flags: { "smash-burger": "Most ordered" },
        },
      });
    }, undefined, 3.9);

    t.call(p({ beat: 2 }), undefined, 6.0);
    t.call(() => {
      dispatch({
        type: "msg",
        msg: {
          id: "g2",
          from: "guest",
          text: "something mildly spiced for my mom",
        },
      });
    }, undefined, 6.1);
    t.call(p({ typing: true }), undefined, 6.9);
    t.call(() => {
      dispatch({ type: "patch", patch: { typing: false } });
      const mk = dish("mac-and-cheese");
      dispatch({
        type: "msg",
        msg: {
          id: "o2",
          from: "orderly",
          text: "The mac and cheese has no heat at all. Three cheeses, very gentle.",
          dishes: mk ? [mk] : [],
          chip: "Mild",
          addOn: "mac-and-cheese",
        },
      });
    }, undefined, 7.5);

    // The Add button presses itself (§8.4).
    t.call(() => dispatch({ type: "patchLastMsg", patch: { addPressed: true } }), undefined, 9.3);
    t.call(() => {
      dispatch({ type: "patchLastMsg", patch: { addPressed: false } });
      dispatch({ type: "add", id: "mac-and-cheese" });
    }, undefined, 9.6);

    /* ── VOICE · 4s ──────────────────────────────────────────────── */
    t.call(p({ beat: 3, mode: "voice", voiceLive: true }), undefined, 11.0);

    // Transcript types itself, character by character.
    const line = VOICE_LINE;
    const typed = { n: 0 };
    t.to(
      typed,
      {
        n: line.length,
        duration: 1.1,
        ease: "none",
        onUpdate: () => {
          dispatch({
            type: "patch",
            patch: { transcript: line.slice(0, Math.round(typed.n)) },
          });
        },
      },
      12.2,
    );

    t.call(() => {
      // Speech ends: the strip retires and what was said becomes a guest line.
      dispatch({
        type: "msg",
        msg: { id: "g3", from: "guest", text: line },
      });
      dispatch({ type: "patch", patch: { voiceLive: false, transcript: "" } });
      dispatch({ type: "add", id: "vanilla-shake" });
    }, undefined, 14.2);

    /* ── UPSELL · 2s ─────────────────────────────────────────────── */
    t.call(p({ beat: 4, mode: "chat", upsellVisible: true }), undefined, 15.2);
    t.call(() => {
      dispatch({ type: "patch", patch: { upsellVisible: false } });
      dispatch({ type: "add", id: "garlic-fries" });
    }, undefined, 16.6);

    /* ── PAY · 2s ────────────────────────────────────────────────── */
    t.call(p({ beat: 5, pay: "open" }), undefined, 17.4);
    t.call(p({ pay: "paid" }), undefined, 18.7);

    /* ── ROUTE · 1.5s ────────────────────────────────────────────── */
    t.call(p({ beat: 6, pay: "hidden", routed: true }), undefined, 19.8);

    /* ── HANDOFF ─────────────────────────────────────────────────── */
    t.call(p({ beat: 7, handoff: true }), undefined, 21.2);

    tl.current = t;

    /* Scroll drives the playhead. §8.4 keeps its loop, but a reader who scrolls
       quickly should see the beats arrive quickly rather than watch a timer run
       at its own pace while they wait. Scrolling through the held section can
       only push the playhead FORWARD, never drag it back, so beats never
       un-happen and the ticket stays honest. Stop scrolling and the timeline
       carries on by itself at its normal speed. */
    const section = document.getElementById("guest");
    const st = section
      ? ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            if (stopped.current) return;
            const target = self.progress * t.duration();
            if (t.time() < target) t.time(target);
          },
        })
      : null;

    return () => {
      st?.kill();
      t.kill();
      tl.current = null;
    };
  }, [active]);

  /** Called when the reader types. The loop never resumes after this. */
  const takeOver = () => {
    if (stopped.current) return;
    stopped.current = true;
    tl.current?.kill();
    tl.current = null;
    dispatch({ type: "patch", patch: { beat: 7, handoff: true, mode: "chat" } });
  };

  const total = useMemo(
    () => state.cart.reduce((sum, id) => sum + (dish(id)?.price ?? 0), 0),
    [state.cart],
  );

  return { state, dispatch, total, takeOver };
}
