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

  nav: {
    links: [
      { label: "How it works", href: "#guest" },
      { label: "For your team", href: "#value" },
      { label: "Integrations", href: "#journey" },
      { label: "Contact", href: "#lastcall" },
    ],
  },
} as const;
