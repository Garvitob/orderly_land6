"use client";

import type { Dish } from "@/lib/types";
import { money } from "@/lib/menu";
import { Label } from "@/components/primitives/Label";
import { cn } from "@/lib/cn";

/**
 * A dish inside the conversation. The name is Instrument Serif italic because
 * it is what a person would say; the price and the Add control are Hanken
 * because they are interface (§4.4).
 *
 * `flag` carries MOST ORDERED, which is §8.4's single orange accent for this
 * section. Nothing else in the phone is orange.
 */
export function DishCard({
  dish,
  flag,
  chip,
  showAdd,
  pressed,
}: {
  dish: Dish;
  flag?: string;
  chip?: string;
  showAdd?: boolean;
  pressed?: boolean;
}) {
  return (
    <div className="dishcard">
      {flag ? (
        <Label tone="orange" className="dishcard-flag">
          {flag}
        </Label>
      ) : null}

      <div className="dishcard-row">
        <p className="dishcard-name t-serif">{dish.name}</p>
        <span className="dishcard-price tnum">{money(dish.price)}</span>
      </div>

      <p className="dishcard-note">{dish.note}</p>

      {chip || showAdd ? (
        <div className="dishcard-foot">
          {chip ? <span className="chip">{chip}</span> : null}
          {showAdd ? (
            <span className={cn("dishcard-add", pressed && "is-pressed")}>
              Add
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
