import type { Dish } from "./types";

/**
 * An American menu. Prices are held exactly where §8.4 fixes them so the
 * demo's headline arithmetic is unchanged:
 *   12.95 + 11.50 + 4.50 + 3.50 = 32.45
 */
export const MENU: readonly Dish[] = [
  {
    id: "smash-burger",
    name: "Smash Burger",
    price: 12.95,
    tags: ["bestseller", "rich"],
    note: "double patty, house sauce",
  },
  {
    id: "nashville-hot",
    name: "Nashville Hot Chicken",
    price: 14.95,
    tags: ["bestseller", "spicy"],
    note: "cayenne butter, pickles",
  },
  {
    id: "mac-and-cheese",
    name: "Mac and Cheese",
    price: 11.5,
    tags: ["mild", "vegetarian"],
    note: "three cheeses, no heat",
  },
  {
    id: "farm-salad",
    name: "Farm Salad",
    price: 10.95,
    tags: ["vegetarian", "glutenfree"],
    note: "market greens, no croutons",
  },
  {
    id: "skillet-cornbread",
    name: "Skillet Cornbread",
    price: 9.5,
    tags: ["vegetarian", "mild"],
    note: "honey butter, cast iron",
  },
  {
    id: "garlic-fries",
    name: "Garlic Fries",
    price: 3.5,
    tags: ["side"],
    note: "hand cut, parsley and salt",
  },
  {
    id: "vanilla-shake",
    name: "Vanilla Shake",
    price: 4.5,
    tags: ["drink"],
    note: "thick, real vanilla",
  },
  {
    id: "coke",
    name: "Coke",
    price: 2.5,
    tags: ["drink"],
    note: "chilled can",
  },
  {
    id: "apple-pie",
    name: "Apple Pie",
    price: 5.5,
    tags: ["dessert"],
    note: "warm, cinnamon crust",
  },
] as const;

export function dish(id: string): Dish | undefined {
  return MENU.find((d) => d.id === id);
}

/** §8.4's cart, in the order the demo adds it. */
export const CART_SEQUENCE = [
  "smash-burger",
  "mac-and-cheese",
  "vanilla-shake",
  "garlic-fries",
] as const;

export const CART_TOTAL = CART_SEQUENCE.reduce((sum, id) => {
  const d = dish(id);
  return sum + (d ? d.price : 0);
}, 0);

// Guard against a silent data edit breaking the demo's headline number.
if (Math.abs(CART_TOTAL - 32.45) > 0.001) {
  throw new Error(
    `Demo cart total must be 32.45, got ${CART_TOTAL.toFixed(2)}. See §8.4.`,
  );
}

export const money = (n: number) => `$${n.toFixed(2)}`;
