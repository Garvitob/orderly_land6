import type { Dish, Intent, Reply } from "./types";
import { MENU, dish } from "./menu";

/**
 * §8.4's demo brain. Scripted and deterministic. No API, no key, no backend,
 * no network. It is a keyword matcher with a priority order, and that is the
 * whole point: an operator on a sales call can hit it a hundred times and it
 * will never say anything the client did not approve.
 *
 * Voice: a great host. Confident, brief, genuinely helpful. Sentence case, no
 * exclamation marks, no em dashes. Replies are the brief's verbatim strings.
 */

const pick = (...ids: string[]): readonly Dish[] =>
  ids.map(dish).filter((d): d is Dish => Boolean(d));

const byTag = (tag: string): readonly Dish[] => MENU.filter((d) => d.tags.includes(tag));

/** Priority matters: allergy before vegetarian, mild before recommend (§8.4). */
const INTENTS: readonly { intent: Intent; keywords: readonly string[] }[] = [
  { intent: "allergy", keywords: ["allerg", "allergic", "intoleran", "coeliac", "celiac", "nut", "dairy", "lactose", "avoid", "cannot eat", "cant eat"] },
  { intent: "glutenfree", keywords: ["gluten", "gf", "wheat"] },
  { intent: "mild", keywords: ["mild", "not spicy", "no heat", "not too hot", "gentle", "for my mom", "for my kid", "child", "bland"] },
  { intent: "spicy", keywords: ["spicy", "spice", "hot", "heat", "chilli", "chili", "fiery"] },
  { intent: "vegetarian", keywords: ["vegetarian", "veggie", "veg", "no meat", "meatless", "vegan"] },
  { intent: "drink", keywords: ["drink", "lassi", "coke", "soda", "thirsty", "beverage", "water"] },
  { intent: "dessert", keywords: ["dessert", "sweet", "pudding", "jamun", "afters"] },
  { intent: "price", keywords: ["price", "cost", "how much", "cheap", "expensive", "budget"] },
  { intent: "modify", keywords: ["without", "no onion", "extra", "on the side", "swap", "change", "instead of", "modify"] },
  { intent: "pay", keywords: ["pay", "payment", "card", "bill", "check", "checkout"] },
  { intent: "recommend", keywords: ["recommend", "best", "popular", "favourite", "favorite", "good", "should i", "what do you"] },
  { intent: "greet", keywords: ["hi", "hey", "hello", "good evening", "good afternoon"] },
];

/** Normalise: lowercase, strip punctuation, collapse whitespace, cap at 200
 *  chars for matching (§8.4). */
export function normalise(input: string): string {
  return input
    .toLowerCase()
    .slice(0, 200)
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function classify(input: string): Intent {
  const text = normalise(input);
  if (!text) return "fallback";
  for (const { intent, keywords } of INTENTS) {
    for (const k of keywords) {
      // whole-word match for short keys so "veg" does not fire inside "vegas"
      if (k.length <= 3) {
        if (new RegExp(`\\b${k}\\b`).test(text)) return intent;
      } else if (text.includes(k)) {
        return intent;
      }
    }
  }
  return "fallback";
}

const REPLIES: Record<Intent, () => Reply> = {
  recommend: () => ({
    text: "Butter chicken goes out more than anything else on the menu. The rogan josh if you want heat.",
    dishes: pick("butter-chicken", "rogan-josh"),
  }),
  glutenfree: () => ({
    text: "Paneer tikka is naturally gluten free, and the dal makhani. I would skip the naan. I can bring rice instead.",
    dishes: pick("paneer-tikka", "dal-makhani"),
    chip: "Gluten free",
  }),
  allergy: () => ({
    text: "Tell me what to avoid and I will only show you what is safe.",
  }),
  mild: () => ({
    text: "Malai kofta has no heat at all. Cashew cream, very gentle.",
    dishes: pick("malai-kofta"),
    chip: "Mild",
  }),
  pay: () => ({
    text: "I can take payment right here when you are ready.",
  }),
  spicy: () => ({
    text: "Lamb rogan josh, Kashmiri chillies. That is the one with real heat.",
    dishes: pick("rogan-josh"),
    chip: "Spicy",
  }),
  vegetarian: () => ({
    text: "Plenty. Paneer tikka off the tandoor, dal makhani, or malai kofta if you want it gentle.",
    dishes: byTag("vegetarian").slice(0, 3),
    chip: "Vegetarian",
  }),
  drink: () => ({
    text: "Mango lassi is made in house and it is thick. There is chilled Coke if you would rather.",
    dishes: pick("mango-lassi", "coke"),
  }),
  dessert: () => ({
    text: "Gulab jamun, warm, in syrup. One order is enough for two.",
    dishes: pick("gulab-jamun"),
  }),
  price: () => ({
    text: "Mains run 9.50 to 14.95. Sides and drinks are under 5.",
  }),
  modify: () => ({
    text: "I can change any line. Tell me what to leave out and the kitchen sees it on the ticket.",
  }),
  greet: () => ({
    text: "Good evening. I can recommend something, or tell you what is safe to eat.",
  }),
  fallback: () => ({
    text: "I can help with that at the table. For the demo, try asking for a recommendation, something vegetarian, or a drink.",
  }),
};

export function respond(input: string): Reply {
  return REPLIES[classify(input)]();
}

/** §8.4: over 200 characters is accepted, and the echo is truncated at 120
 *  with an ellipsis. Never an error state. */
export function echoOf(input: string): string {
  const trimmed = input.trim();
  return trimmed.length > 200 ? `${trimmed.slice(0, 120)}…` : trimmed;
}

/** A 400 to 700ms thinking delay, randomised in that band. Called from a
 *  handler, never during render (§14.1). */
export function thinkingDelay(): number {
  return 400 + Math.random() * 300;
}
