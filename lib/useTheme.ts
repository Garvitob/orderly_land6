"use client";

import { useCallback, useSyncExternalStore } from "react";
import { ScrollTrigger } from "@/lib/gsap";

export type Theme = "light" | "dark";

export const THEME_KEY = "orderly-theme";

/** Kept under 200 bytes and injected in <head> so the theme lands before
 *  first paint. Must stay in sync with THEME_KEY. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}})()`;

/* The DOM attribute is the single source of truth. React subscribes to it
   rather than owning it, which is what keeps the paint flash-free: the inline
   head script has already set it before React exists. */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

export function setTheme(next: Theme): void {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // private mode. the swap still applies for this session.
  }
  listeners.forEach((l) => l());
  // Pinned trigger geometry is measured against painted layout, so refresh
  // once the swap has actually painted (§4.3).
  window.setTimeout(() => ScrollTrigger.refresh(), 50);
}

/**
 * The visual theme is driven entirely by [data-theme] on <html> plus CSS
 * variables, never by React state (§4.3, §14.1). This hook exists so the
 * toggle can report an accurate aria-checked and so callers can flip it.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    setTheme(getSnapshot() === "dark" ? "light" : "dark");
  }, []);

  return { theme, toggle };
}
