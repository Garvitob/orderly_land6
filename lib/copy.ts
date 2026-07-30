/**
 * Every shipped string that §12 fixes, in one place, so the step 20 audit can
 * check verbatim compliance without walking the component tree.
 *
 * Rules enforced by inspection here: sentence case except Label, no em dashes,
 * no exclamation marks, no §5.3 banned vocabulary, headlines at or under 12
 * words.
 */
export const COPY = {
  brand: "Orderly",
  masterTagline: "Keep your restaurant Orderly",

  act1: {
    label: "AI ordering for modern hospitality",
    display: "The best employee your restaurant has ever had.",
    subhead:
      "Guests scan a QR code and order by speaking naturally. Orders land in the point of sale you already run.",
    overheardLabel: "What guests are saying right now",
    ctaPrimary: "Get a demo",
    ctaSecondary: "See how it works",
    scrollCue: "Scroll",
  },

  /** §8.2. The first line is the kit's own sanctioned guest quote. */
  overheard: [
    "Something spicy, but not too heavy. What do you have?",
    "Is this gluten free?",
    "Can we get that without onions?",
    "What do you recommend?",
    "Actually, make that two.",
  ],

  turn: {
    titleCard: "Scan, speak, done.",
  },

  /** §8.4. The Label asserts the category, which the headline-only test
   *  otherwise never states. Approved swap from HOW IT WORKS FOR A GUEST. */
  guest: {
    label: "The conversational ordering layer",
    headline: "A conversation, not a form.",
    subhead:
      "Your guest scans the code on the table and talks. Orderly answers questions, handles what they cannot eat, and takes payment. You get a clean ticket.",
    venue: "Copper Skillet",
    table: "Table 12",
  },

  /** §6.3. Not optional. The caption changes on every beat, so someone who
   *  reads nothing else still understands the business by the end of a loop. */
  captions: {
    menu: "Your guest scans the QR. No app, no sign up",
    conversation1: "They ask a question. Orderly answers like a host would",
    conversation2: "It handles preferences and dietary needs",
    voice: "Or they just say it out loud",
    upsell: "It suggests one thing they will actually want",
    pay: "They pay in the same conversation",
    route: "The order lands in the POS you already run",
    handoff: "Live demo. Type anything",
  },

  /** The demo's own lines, shared so §8.6's panels and §8.4's phone say the
   *  same thing in the same voice rather than drifting into two scripts. */
  demoLines: {
    upsell: "Garlic fries with that? They go with the smash burger.",
    askGlutenFree: "is this gluten free?",
    replyGlutenFree: "The farm salad is, and the Nashville hot without the bun.",
    askMild: "something mildly spiced for my mom",
    replyMild: "The mac and cheese has no heat at all. Three cheeses, very gentle.",
    spoken: "and a vanilla shake",
  },

  nav: {
    links: [
      { label: "How it works", href: "#guest" },
      { label: "For your team", href: "#value" },
      { label: "Integrations", href: "#journey" },
      { label: "Contact", href: "#lastcall" },
    ],
  },
} as const;
