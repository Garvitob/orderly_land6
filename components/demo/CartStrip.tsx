"use client";

import { money } from "@/lib/menu";
import { Label } from "@/components/primitives/Label";

/**
 * The cart strip. Totals are Hanken with tabular figures so the number never
 * reflows as it counts (§5.2), and the count-up is driven by the loop rather
 * than by this component.
 */
export function CartStrip({
  count,
  total,
  totalId,
}: {
  count: number;
  total: number;
  totalId?: string;
}) {
  return (
    <div className="cartstrip">
      <Label tone="text-2">
        {count === 1 ? "1 item" : `${count} items`}
      </Label>
      <span className="cartstrip-total tnum" id={totalId}>
        {money(total)}
      </span>
    </div>
  );
}
