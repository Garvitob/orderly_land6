import type { Dish } from "./types";

/** §8.4, verbatim. Do not invent prices beyond this list (§12). */
export const MENU: readonly Dish[] = [
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    price: 12.95,
    tags: ["bestseller", "rich"],
    note: "slow cooked, mild heat",
  },
  {
    id: "rogan-josh",
    name: "Lamb Rogan Josh",
    price: 14.95,
    tags: ["bestseller", "spicy"],
    note: "Kashmiri chillies",
  },
  {
    id: "malai-kofta",
    name: "Malai Kofta",
    price: 11.5,
    tags: ["mild", "vegetarian"],
    note: "cashew cream, no heat",
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    price: 10.95,
    tags: ["vegetarian", "glutenfree"],
    note: "charred, off the tandoor",
  },
  {
    id: "dal-makhani",
    name: "Dal Makhani",
    price: 9.5,
    tags: ["vegetarian", "mild"],
    note: "black lentils, overnight",
  },
  {
    id: "garlic-naan",
    name: "Garlic Naan",
    price: 3.5,
    tags: ["side"],
    note: "blistered, brushed with ghee",
  },
  {
    id: "mango-lassi",
    name: "Mango Lassi",
    price: 4.5,
    tags: ["drink"],
    note: "thick, house made",
  },
  {
    id: "coke",
    name: "Coke",
    price: 2.5,
    tags: ["drink"],
    note: "chilled can",
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    price: 5.5,
    tags: ["dessert"],
    note: "warm, in syrup",
  },
] as const;

export function dish(id: string): Dish | undefined {
  return MENU.find((d) => d.id === id);
}

/** §8.4's arithmetic, asserted in code as the brief requires.
 *  12.95 + 11.50 + 4.50 + 3.50 = 32.45 */
export const CART_SEQUENCE = [
  "butter-chicken",
  "malai-kofta",
  "mango-lassi",
  "garlic-naan",
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
