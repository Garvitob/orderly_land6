"use client";

import { MENU, money } from "@/lib/menu";
import { cn } from "@/lib/cn";

/**
 * The Menu mode. A scrolling dish list, not a card grid: §5.1 bans the
 * icon-title-two-grey-lines pattern and this is a menu, which in real life is
 * a list with rules between items.
 *
 * Dish names are Instrument Serif italic (§4.4: a dish name is a person's
 * words). Prices are Hanken with tabular figures.
 */
export function MenuGrid({ tapped }: { tapped?: string }) {
  return (
    <ul className="menugrid">
      {MENU.map((d) => (
        <li
          key={d.id}
          className={cn("menurow", tapped === d.id && "is-tapped")}
          data-dish={d.id}
        >
          <div className="menurow-main">
            <p className="menurow-name t-serif">{d.name}</p>
            <p className="menurow-note">{d.note}</p>
          </div>
          <span className="menurow-price tnum">{money(d.price)}</span>
        </li>
      ))}
    </ul>
  );
}
