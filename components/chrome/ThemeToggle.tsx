"use client";

import { useTheme } from "@/lib/useTheme";
import { cn } from "@/lib/cn";

/**
 * SERVICE / AFTER HOURS, the brand's own vocabulary for the two states (§4.3).
 * The knob travels on a slight overshoot in 220ms because it is directly
 * manipulated (§10.1). It does not cross-fade and it does not teleport.
 *
 * Position is pure CSS off [data-theme], so the correct state is painted by
 * the inline head script with no flash and no hydration mismatch.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === "dark"}
      aria-label="Switch between service and after hours"
      onClick={toggle}
      className={cn("otoggle", className)}
    >
      <span className="otoggle-knob" aria-hidden="true" />
      <span className="t-label otoggle-lab otoggle-lab--light">Service</span>
      <span className="t-label otoggle-lab otoggle-lab--dark">After hours</span>
    </button>
  );
}
