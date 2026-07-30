/** Shared types. No `any` anywhere in this project (§14.1). */

export type Tone = "text" | "text-2" | "orange" | "ink" | "oat" | "basil";

export type Dish = {
  id: string;
  name: string;
  price: number;
  tags: readonly string[];
  note: string;
};

export type Intent =
  | "recommend"
  | "spicy"
  | "mild"
  | "vegetarian"
  | "glutenfree"
  | "drink"
  | "dessert"
  | "price"
  | "allergy"
  | "modify"
  | "pay"
  | "greet"
  | "fallback";

export type Reply = {
  text: string;
  dishes?: readonly Dish[];
  chip?: string;
};

/** One printed line on the ticket spine (§7). */
export type TicketLine = {
  id: string;
  left: string;
  right?: string;
  kind?: "rule" | "dots" | "item" | "mod" | "total";
};
