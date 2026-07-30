# ORDERLY — MASTER BUILD BRIEF
## Final. Three acts, one scroll.

You are the design lead at a small studio known for work that could never be mistaken for anyone else's. You are building the marketing landing page for **Orderly** (orderly.sh), a conversational ordering layer for restaurants.

Two previous attempts were rejected for looking templated. This brief is specific on purpose. Where it leaves an axis free, do not spend that freedom on a default.

**Four things, all non-negotiable:**

1. **The first screen is cinema.** A dark room, a video, a few perfect lines of type. Nothing else.
2. **Everything after it is explanation.** Heavily animated, and every animation teaches something about the product.
3. **It must never look AI-generated.** The client's own brand kit says it: *"Sci fi. No robots, no glowing brains, ever."*
4. **It must deploy clean.** Zero TypeScript errors, zero hydration warnings, `npm run build` green. §14 is a gate, not a suggestion.

**Read all of this before you act. Then do §16 before writing any code.**

---

# §0 · PREFLIGHT

Setup is done. **Do not run `create-next-app`. Do not install packages.** Run every check, report a pass/fail table, and do not begin building until every row passes or I tell you to proceed anyway.

```bash
node -v                                        # >= 20
npm ls gsap                                    # >= 3.13   critical
npm ls lenis clsx tailwind-merge vaul sonner
npm ls sharp
ls public/logo.svg
ls public/video/
npx tsc --noEmit                               # must be clean before you start
```

| Check | Must be | If it fails |
|---|---|---|
| Node | `>= 20` | Stop. Tell me to upgrade. |
| **gsap** | **`>= 3.13`** | `npm i gsap@latest`, re-check. Below 3.13 the free package has no `SplitText`, `DrawSVGPlugin` or `MotionPathPlugin`, and §8.2, §8.5 and §8.9 are impossible. **The single most important version check here.** |
| runtime deps | all present | `npm i <missing>` |
| `public/logo.svg` | exists | Stop and ask me. Never draw a substitute mark. |
| **`public/video/`** | the 7 files in §3 | Stop and name the exact missing files. Never reference a video path that does not exist. |
| **Playwright MCP** | `/mcp` shows `playwright` connected | If `.mcp.json` is correct but `/mcp` is empty, tell me to reload the VS Code window. **MCP registers only at session start. Nothing you do mid-session fixes it.** Do not silently fall back to CLI screenshots. Ask. |
| skills | `/skills` lists `frontend-design`, `emil-design-eng`, `apple-design`, `review-animations` | `npx skills add ...`, then reload |
| `tsc --noEmit` | clean | Fix before building anything |

**Fonts need no check.** Both brand faces are on Google Fonts (§4.4). Nothing to download, nothing to fall back from.

## §0.1 Skills — use these narrowly. Most of what is installed is wrong for this job.

| Skill | Load? | Scope, and the limit |
|---|---|---|
| `frontend-design` | **Yes, at start** | Aligned with this brief. Follow it. If it conflicts with §4 tokens, this brief wins: those values are the client's brand book. |
| `emil-design-eng` | **Yes, at start** | Authoritative for the **interaction layer only** (§10.1). Its timing rules do not apply to scroll choreography. |
| `apple-design` | **Yes, at start** | Fluid-motion feel and restraint only. **Ignore anything pushing iOS component conventions.** This is a marketing page, not an app. No iOS list rows, no SF-style segmented controls outside the phone mockup. |
| `review-animations` | **Once, at step 22** | Interaction layer only. Read §10.2 first. |
| `pick-ui-library` | **Never** | Recommends shadcn/Radix. Both banned (§0.2). |
| `prototype` | **Never** | Optimises for throwaway speed. This is production. |
| `find-animation-opportunities` | **Never** | This page already has 38 animated moments. Your risk is too much motion, not too little. |
| `improve-animations` | **Never** | Overlaps `review-animations` and re-litigates settled decisions. |

**Install no additional skills.** Marketplace "Awwwards" skills ship glassmorphism and 16px-radius boilerplate, which §5 bans.

**The one hard rule about skills:** a skill may inform *how* you implement something. It may never override *what* §4 through §9 say to build. If a skill tells you to do something this brief forbids, follow the brief and note the conflict in your report.

## §0.2 Do NOT install

Framer Motion / `motion` · shadcn/ui · MUI · Chakra · Radix beyond Vaul's · AOS · ScrollReveal · three.js · react-spring · lottie · **video.js / plyr / any video player library** · any particle library · any icon set other than `lucide-react` · any Tailwind plugin beyond defaults.

**Why no Framer Motion:** it writes transforms through its MotionValue system while GSAP writes through its own cache. Both touching one element produces jitter that is miserable to debug. One library owns `transform` per element. This page needs pinning, `MotionPath` with `autoRotate`, and absolute-time timelines. GSAP has all three as primitives.

**Why no video player library:** the hero is a muted, looping, controls-free background plate. Native `<video>` is correct. A library is 40kb of nothing.

## §0.3 Photography

You cannot generate images. The two videos in §3 carry all the photographic weight. If a section still wants a still, build `components/primitives/PhotoSlot.tsx`: an Oat block at a given aspect ratio with a centred Label-style caption naming the required image and dimensions. List every instance in your final report.

---

# §1 · THE PRODUCT

**Official description, from the brand kit:**

> Orderly turns any menu, table, counter, or drive thru into a conversation. Guests scan a QR code and order by speaking naturally. The AI answers questions, recommends dishes, handles customizations, and takes payment. Orders land directly in the restaurant's existing point of sale.
>
> No app to download. No workflow to change. Just faster, smarter, more personal ordering.

**Positioning, verbatim:**

> Orderly is the conversational ordering layer for restaurants. It works with what you have, and makes every order faster, larger, and more personal.

Three things earlier drafts got wrong and this page must get right:

- **It takes payment.** The flow ends in payment, not just a sent ticket. The demo shows this.
- **It is not only tables.** Menu, table, counter, drive thru.
- **The category is "conversational ordering layer."** Not "voice ordering." Not "chatbot."

**Audience:** restaurant owners, operators, multi-unit executives. Not diners. Busy, sceptical, sold bad tech before, and they decide in about forty seconds.

## §1.1 We are / we are not — verbatim, and this becomes §8.5

| WE ARE | WE ARE NOT |
|---|---|
| An intelligent ordering assistant | A chatbot in a window |
| A layer on top of existing operations | A point of sale or kiosk replacement |
| Premium, warm, and effortless | Another ordering app |
| Built for outcomes: revenue, speed, satisfaction | Sci fi. No robots, no glowing brains, ever. |

---

# §2 · THE THREE ACTS

Hold this in your head the whole way through.

```
ACT I    THE ROOM          dark, video, pinned 130vh
                           You are looking down into a full restaurant at night.
                           Four lines of type. One button. Nothing else.

ACT II   THE TURN          the transition, tail of the same pin
                           The video darkens away. A strip of receipt paper feeds
                           in from the top of the left gutter. The page becomes paper.

ACT III  THE EXPLANATION   paper, 12 beats, heavily animated
                           Every animation teaches something. The ticket spine
                           prints a line at each section. By the footer the order
                           is complete and FIRED stamps onto it.
```

**The turn is the whole idea.** The video hero and the ticket spine are not two features bolted together. The printer starting *is* the transition from cinema to explanation. Get §8.3 right and the page has a spine no competitor can copy.

**Theme behaviour across the acts.** Act I is dark in **both** themes: it is a video plate, always night. The difference is what happens at the turn:

- **SERVICE (light, default):** the turn is a dawn. Ink lifts to Oat and Act III is paper.
- **AFTER HOURS (dark):** the turn is quieter. Ink stays, surfaces lift to `--surface-2`, and the ticket paper is the only bright thing on the page.

Light loads first. The toggle is in the nav from the first frame.

---

# §3 · THE VIDEO ASSETS — ALREADY ENCODED. DO NOT RE-ENCODE.

Seven files in `public/video/`. All licensed for commercial use.

| File | Use | Size | Notes |
|---|---|---|---|
| `hero.webm` | Act I primary | 432 KB | 1920×876, 12s, 24fps, silent |
| `hero.mp4` | Act I Safari fallback | 932 KB | same |
| `hero-mobile.webm` | Act I under 900px | 96 KB | 800px wide |
| `hero-poster.jpg` | Act I poster + reduced motion | 72 KB | frame at 3s |
| `break.webm` | §8.8 full-bleed break | 260 KB | 1920×864, 10s |
| `break.mp4` | §8.8 fallback | 948 KB | same |
| `break-poster.jpg` | §8.8 poster | 68 KB | |

## §3.1 What the hero footage is, and why the type works over it

An overhead shot through a glass facade, looking down into a full restaurant at night. Warm pendant lights, wooden communal tables, people eating. Locked-off camera: **only the people move.** Already cropped, blurred `sigma 2.2`, brightness −6%, saturation −12%.

Measured on the graded plate:

```
mean luma             11.5 / 255
pixels under luma 60   96.4%
pixels over luma 180    0.55%
headline zone luma     10.5  ->  Oat #FAF6F0 lands at 11.1:1
```

**11.1:1 passes AAA.** The type needs no heavy scrim and absolutely no text shadow. §8.2 specifies a soft radial scrim for safety at extreme crops only.

**The locked-off camera is an advantage, not a flaw.** You supply the camera move: `scale 1 → 1.08` scrubbed across the pin, so the push belongs to the user's scroll. A baked camera move would fight the scrub. Do not add one.

## §3.2 Markup rules — non-negotiable

```tsx
<video
  ref={videoRef}
  poster="/video/hero-poster.jpg"
  muted
  loop
  playsInline
  preload="metadata"
  aria-hidden="true"
>
  <source src="/video/hero.webm" type="video/webm" />
  <source src="/video/hero.mp4"  type="video/mp4" />
</video>
```

- `muted` and `playsInline` are mandatory. Without both, iOS refuses to autoplay.
- `preload="metadata"`, never `auto`. The poster covers the gap.
- **Never use the `autoPlay` prop.** Call `.play()` in an effect and swallow the rejection: `void ref.current?.play().catch(() => {})`. Browsers reject autoplay unpredictably and an unhandled rejection fails §14.
- **Under `prefers-reduced-motion`: render the poster as a plain `<img>` and never mount the video element at all.**
- **Under 900px: render `hero-mobile.webm` only.**
- Never animate `filter` on the video. The blur is baked in. Animated blur destroys frame rate.
- Pause via `IntersectionObserver` when Act I leaves the viewport.

## §3.3 If a video fails to load

`onError` sets a state flag, the poster stays, the page continues. **Act I must be fully readable and functional with no video at all.** Test by renaming the files.

---

# §4 · DESIGN SYSTEM — FROM THE CLIENT'S BRAND KIT

## §4.1 Colour

```css
/* SERVICE  ·  light  ·  default */
:root, [data-theme="light"] {
  --orange:      #FD6001;  /* Orderly Orange. actions, mark, accents. LOCKED */
  --ink:         #201A16;  /* headlines, body */
  --oat:         #FAF6F0;  /* backgrounds, cards */
  --white:       #FFFFFF;
  --peach:       #FFE7D6;  /* tints */
  --stone:       #8C8177;  /* secondary text */
  --basil:       #1E7A46;  /* success states ONLY */

  --surface:     var(--oat);
  --surface-2:   var(--white);
  --text:        var(--ink);
  --text-2:      var(--stone);
  --rule:        rgba(32,26,22,0.10);
}

/* AFTER HOURS  ·  dark  ·  DERIVED, flag for client approval */
[data-theme="dark"] {
  --surface:     #201A16;
  --surface-2:   #2A2320;
  --text:        #FAF6F0;
  --text-2:      #8C8177;
  --rule:        rgba(250,246,240,0.12);
  --orange:      #FD6001;
  --orange-lift: #FF7A2E;  /* small orange text on ink only */
  --peach:       #3A2A20;
  --basil:       #2E9C5C;
}

/* ACT I  ·  theme-invariant. The room is always night. */
:root {
  --act1-bg:     #0C0A08;
  --act1-text:   #FAF6F0;
  --act1-text-2: #C9C1B8;
}
```

**Never hard-code a hex outside these blocks.** Grep for `#` at step 20 and justify every hit.

**Brand proportions, a hard target:** `Oat 60 · White 20 · Ink 12 · Orange 8`. In dark mode: `Ink 60 · lifted-ink 20 · Oat 12 · Orange 8`. Orange stays at 8 either way.

## §4.2 Orange discipline — the most important visual rule on the page

The brand's own sentence:

> Orange is the seasoning, not the dish: use it for the mark, key actions, and one accent per layout.

**One orange accent per section, beyond the mark and CTA fills. Not two.** In §16 you list your single accent for every section before building. That constraint does more for this page than everything else in §5.

**Forbidden:** orange glows · orange drop shadows · orange gradients · orange hover borders · orange background haze · orange dividers · orange focus rings · orange link underlines.

**Accessibility, verbatim from the kit:** body text is always Ink on Oat or Ink on white. White on Orderly Orange **only at 18px bold and above** — below that, Ink on orange. **Never orange text on peach.**

If something feels flat, reach for Ink or Basil.

## §4.3 The theme toggle

Two service states, in the brand's vocabulary: **SERVICE** (light) and **AFTER HOURS** (dark).

A `999px` pill, `--rule` border, two Label-style labels, and a knob that **travels** with spring feel, `220ms`. It does not teleport or cross-fade. On flip: `document.documentElement.dataset.theme` changes, then `ScrollTrigger.refresh()` after `50ms`.

**No flash, ever.** An inline blocking script in `<head>` reads `localStorage` and sets `data-theme` before first paint. Put it in `layout.tsx` as `<script dangerouslySetInnerHTML>`, under 200 bytes.

## §4.4 Typography — two families, both on Google Fonts

```ts
import { Hanken_Grotesk, Instrument_Serif } from 'next/font/google'

export const sans = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
  adjustFontFallback: true,
})

export const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  variable: '--font-serif',
  display: 'swap',
  adjustFontFallback: true,
})
```

**The brand's framing: "Two voices, one system."**

| Face | Speaks as | Used for |
|---|---|---|
| **Hanken Grotesk** | Orderly, to an operator | All headlines, figures, body, interface |
| **Instrument Serif italic** | **A person** | Guest quotes, the overheard lines in Act I, every chat bubble in the demo, dish names. **Italic only. Never body. Never UI.** |

**No monospace anywhere.** The brand has two voices, not three. Clock, ticket and data text use **Label** style: Hanken 600, uppercase, `+0.14em` tracking, `tabular-nums` where numbers move. Caps plus tracking plus tabular figures reads as system text without a third family.

### Scale

```
ACT1-DISPLAY  800 · -0.03em · leading 1.06 · clamp(2.4rem, 5.2vw, 4rem)
DISPLAY       800 · -0.03em · leading 1.06 · clamp(2.2rem, 4.6vw, 3.5rem)
HEADLINE      700 · -0.02em · leading 1.19 · clamp(1.6rem, 3.2vw, 2rem)
SUBHEAD       600 ·           leading 1.40 · clamp(1.05rem, 1.6vw, 1.25rem)
BODY          400 · 16px    · leading 1.625 · max 62ch
LABEL         600 · 12px    · leading 1.33 · +0.14em · UPPERCASE
FIGURE        800 · -0.03em · leading 0.92 · tabular-nums · clamp(2.6rem, 5.6vw, 4rem)
OVERHEARD     Instrument Serif italic 400 · leading 1.35 · clamp(1.05rem, 2vw, 1.5rem)
```

**Headline maximum: 12 words.** From the brand's own deck rules.

Apply `text-wrap: balance` to every Display and Headline. No package needed, and it stops orphaned words, which are a real tell.

## §4.5 Radius, spacing, elevation

```
RADIUS   0px    rules, tickets, full-bleed bands
         4px    pips, chips, form inputs
         12px   cards, panels, phone screen inner
         999px  buttons, nav pill, toggle
         Nothing else. The flat-versus-pill contrast is deliberate.

SPACING  --sp-breathe  clamp(112px, 15vh, 192px)
         --sp-normal   clamp(80px, 10vh, 120px)
         --sp-tight    clamp(48px, 7vh, 80px)
         --sp-none     0
         Gutter clamp(20px, 5vw, 72px). Max content width 1280px.
         Never uniform. Compose it.

ELEVATION  No drop shadows on cards. Depth from surface colour and hairlines.
           Three exceptions: the phone gets a soft contact shadow, the printed
           ticket in §8.9 gets one, Act I's type block gets a radial scrim.
```

## §4.6 The logo — brand rules are absolute

> A plate, a fork, a spoon. The mark is the table setting, simplified.

One colour only: Orange on light, white on orange or Ink. Clear space equal to the spoon bowl height. Minimum 24px. **Never stretch, squash, recolour, add effects, or rotate.** "Effects" includes glows, shadows and gradient fills.

**One permitted animation:** a single DrawSVG stroke reveal in Act I's opening, once per session. After that it is static forever. No hover animation, no scroll animation, no idle loop.

---

# §5 · THIS MUST NOT LOOK AI-GENERATED

The brand kit sets this constraint itself, twice: *"Sci fi. No robots, no glowing brains, ever."* and *"No clip art, no robots, no glowing anything."*

## §5.1 Banned

**Layout**
- **A row or grid of dark photo cards with a gradient scrim and white text at the bottom.** The most recognisable template pattern in existence. Not a row, not one. (§8.8's single full-bleed video break with an ink scrim is the one exception, because the brand kit prescribes exactly that treatment for section breaks.)
- Grids where every card is `[icon] [bold title] [two grey lines]` at identical heights.
- Everything centred. Every section the same max-width. Every section the same padding.
- `border-radius: 16px` on every surface. Bento grids.
- Generic hero: centred headline, subtitle, two buttons, laptop mockup below.

**Colour and surface**
- Purple, violet, indigo. Gradient mesh. Aurora blobs.
- Glassmorphism as a global style. `backdrop-filter: blur()` on more than one element on the page.
- Cream `#F4F1EA` + high-contrast didone serif + terracotta `#D97757`. That combination is the current AI house style.
- Any colour outside §4.1. Orange as atmosphere.
- **A serif display face.** Reference sites you may have been shown use serif headlines. Orderly's brand kit forbids it: Instrument Serif is italic-only and quotes-only. Headlines are Hanken Grotesk. No exceptions.

**Imagery and icons**
- Sparkle, star, robot, brain, chat-bubble-with-lightning icons. Anything glowing. Clip art.
- Text on footage, except Act I and §8.8 where a scrim makes it legible by design.
- Any image or video path that does not exist on disk.

**Motion**
- Ambient full-bleed waveform wallpaper. Sound visuals live **inside the phone screen only**.
- Reveals that re-fire on scroll-up.
- Animating `filter`, `box-shadow`, or `background-position`.
- **Uniform fade-up-on-scroll applied to every block.** The laziest possible motion and the fastest tell. Every moment in §9 is specific.
- More than three pinned sections.
- Text shadows on type over footage. Use a scrim.

**Copy**
- Title Case headlines. Exclamation marks. **Em dashes.** Headlines over 12 words.
- Banned words: unlock · seamlessly · revolutionize · disrupt · game-changing · next-generation · cutting edge · intelligence layer · leverage · streamline · empower · elevate · supercharge · robust · frictionless · users · bot · chatbot.

## §5.2 Required

- **A grid that visibly shifts.** Base 12 columns. §8.6 and §8.10 break to an 8-column offset hanging right. Perceptible to someone not looking for it.
- **Optical alignment.** Display and Headline at their specified negative tracking. Pull opening quote marks and leading round letters (`O`, `C`, `Q`) into the margin by `0.04em`.
- **Composed vertical rhythm.** §4.5's scale, used with intent. §8.10's three bands touch at zero gap.
- **Real texture.** 3% SVG `feTurbulence` noise fixed over Oat surfaces. Hairlines from `--rule`, never `border-gray-200`. Peach as a genuine tint on one or two panels, not decoration.
- **Tabular figures** on every moving number.
- **Restaurant vernacular** in copy you write: fired · the pass · covers · the rush · on the fly · 86'd · table 12 · last call · front of house.
- **One deliberate rule-break.** Mandated: in §8.9 the section headline runs past the right viewport edge and is clipped. No fade, no mask. Commit.

## §5.3 Style rules from the brand kit — these change how you write everything

- **Sentence case everywhere.** Headlines included. Only Label style is uppercase.
- Short sentences. Nothing over 24 words in body copy.
- **No exclamation marks in product copy.** None.
- **No em dashes in any shipped string.** Use a period, a comma, or a colon. Restructure rather than reach for a dash. Grep for them at step 20. (This brief's own prose uses them. That is fine. Grep your output, not the brief.)
- Numerals for all metrics.
- Say "guests," not "users." Say "conversation," not "chat" — except where `Chat` is the literal name of the product mode in the demo UI, because that is what the live product calls it. Flag this call in your report.

---

# §6 · CLARITY — WEIGHTED EQUALLY WITH THE VISUALS

Act I buys you attention. Act III has to spend it on comprehension.

## §6.1 Every section answers one operator question

Do not build a section until you can name its question. If two sections answer the same one, cut one.

| Section | The question in the operator's head |
|---|---|
| §8.2 Act I | What is this, and is it for someone like me? |
| §8.4 Demo | Show me. What does my guest actually do? |
| §8.5 We are not | Is this going to replace my POS or my staff? |
| §8.6 Four ways in | What if my guests hate talking to machines? |
| §8.7 The numbers | Does it make me money? |
| §8.9 One order | Where does the order actually go? Do I change anything? |
| §8.10 Value | What is in it for me, my staff, my guests? |
| §8.11 Straight answers | The seven things I am actually worried about. |
| §8.12 Quotes | Do real people say this, or just the sales page? |
| §8.14 Last call | How do I start, and how long does it take? |

## §6.2 The headline-only test — a hard gate

Strip the page to its Display, Headline, Label and Figure text. Read only that.

**A stranger must be able to explain Orderly from those words alone.** Run this at step 20 and write the extracted list into your final report so I can check it myself.

## §6.3 The demo must narrate itself — build this, it is not optional

A caption line directly beneath the phone, Label style, `--text-2`, cross-fading `180ms`:

| Beat | Caption |
|---|---|
| Menu | `YOUR GUEST SCANS THE QR. NO APP, NO SIGN UP` |
| Conversation 1 | `THEY ASK A QUESTION. ORDERLY ANSWERS LIKE A HOST WOULD` |
| Conversation 2 | `IT HANDLES PREFERENCES AND DIETARY NEEDS` |
| Voice | `OR THEY JUST SAY IT OUT LOUD` |
| Upsell | `IT SUGGESTS ONE THING THEY WILL ACTUALLY WANT` |
| Pay | `THEY PAY IN THE SAME CONVERSATION` |
| Route | `THE ORDER LANDS IN THE POS YOU ALREADY RUN` |
| Handoff | `LIVE DEMO. TYPE ANYTHING` |

By the end of one loop, someone who read nothing else understands the business.

## §6.4 Plain language

- **No unexplained nouns.** First use in body copy: *"your point of sale: Toast, Square, Clover, or Shift4."* After that, POS alone is fine.
- **Concrete over abstract.** Not "multimodal ordering." Instead: "they can speak, type, or tap."
- **Both halves of every claim.** What the guest does and what the operator gets. *"They ask for something mild. You get a ticket that says mild."*
- **Every section stands alone.** Someone landing mid-page from a shared link must not be lost.
- **Nothing important lives only inside an animation.** If motion carries meaning, static text carries the same meaning beside it. This is also what makes the reduced-motion path honest.

## §6.5 The section skeleton — apply to every Act III section

```
LABEL (12px, caps, tracked)
Headline (Display or Headline scale, sentence case, max 12 words)
One sentence of subhead. One.
The proof: a visual, a number, or a quote. Never a second paragraph.
One text link or one button. Not both.
```

Rigid repetition of this skeleton is what produces the guided-tour feeling. Vary the *visual* wildly. Never vary the skeleton.

---

# §7 · SIGNATURE ELEMENT — THE TICKET SPINE

**One idea the page is remembered for.** It begins at the turn (§8.3) and runs the length of Act III.

A `48px` strip of receipt paper in the left gutter, growing taller as you scroll, like a printer feeding paper. As it passes each section a line prints onto it, character by character, in Label style at `11px`:

```
· · · · · · · · · ·
TABLE 12      7:42
──────────────────
SCAN            ✓
ASKED           ✓
1× BUTTER CHKN
› MILD
1× MALAI KOFTA
1× MANGO LASSI
1× GARLIC NAAN
──────────────────
PAID        32.45
ROUTED · TOAST  ✓
FIRED           ✓
· · · · · · · · · ·
```

By the footer the ticket is complete and `FIRED` stamps onto it in Basil. **The user's scroll places an order.**

## §7.1 Layout requirement — DO NOT SKIP

A previous build let a similar element float over content and clipped a headline in half. That must not happen.

```css
.act3 { display: grid; grid-template-columns: 96px minmax(0, 1fr); }
@media (max-width: 1279px) { .act3 { grid-template-columns: minmax(0, 1fr); } }
```

- The spine occupies column 1. **All content lives in column 2 and never uses negative margins to reach into column 1.**
- Spine is `position: sticky` inside its grid column, `z-index: 1`. Every section is `z-index: 2`. **Never `position: fixed`** — sticky inside the column means it physically cannot escape.
- `minmax(0, 1fr)`, not `1fr`. This prevents grid blowout from long unbreakable content, a real and common bug.
- Below `1280px`: `display: none`, replaced by a `2px` progress rail flush to the left viewport edge with tick marks at the same print points.

**Verify with Playwright at 1280, 1366, 1440 and 1920 that the spine crosses zero content.** Screenshot each.

Perforations: `background-image: radial-gradient(...)` repeated on both edges. Growth: one scrubbed ScrollTrigger over Act III driving `height`. Lines print from each section's own `onEnter`, `once: true`.

---

# §8 · SECTION SPEC

## ACT I — THE ROOM

## §8.1 Nav — present from the first frame

Over the video, no background fill, no blur. Left: the mark in white plus `Orderly` in Hanken 800. Right: **SERVICE / AFTER HOURS** toggle, `Get a demo` as a solid orange pill with **Ink** label text, not white, per §4.2.

**Centre links are hidden in Act I.** They fade in at the turn. Act I is four lines of type and one button. Nothing competes.

At the turn the nav gains a `--surface` fill with a hairline bottom border and the centre links fade up: `How it works` · `For your team` · `Integrations` · `Contact`.

Past `60px` of Act III scroll the nav compresses: `12px` less vertical padding, logo to `0.92`, `220ms`, reversible and interruptible.

**Mobile:** links in a Vaul drawer from the top. Toggle and CTA always visible.

## §8.2 `THE ROOM` — the cold open
### Answers: what is this, and is it for someone like me?

Full-bleed `--act1-bg`. `100svh`. The video fills it, `object-fit: cover`, `scale(1.02)` at rest so the scrubbed push never reveals an edge.

**Over it, one column, left-aligned, starting at the gutter and occupying roughly 52% of width. Not centred.**

A soft radial ink scrim sits behind the type block only:
`radial-gradient(ellipse 70% 90% at 25% 50%, rgba(12,10,8,0.55), transparent 70%)`.
That is how you protect the type. **No text shadow, ever.**

| Element | Spec |
|---|---|
| Mark | 32px, white, DrawSVG stroke reveal `700ms` on load. The only time it ever animates. |
| Label | `AI ORDERING FOR MODERN HOSPITALITY` — Label style, `--orange`. **Act I's one orange accent besides the CTA.** |
| Display | **The best employee your restaurant has ever had.** ACT1-DISPLAY, `--act1-text`, max 18ch per line, `text-wrap: balance` |
| Subhead | *Guests scan a QR code and order by speaking naturally. Orders land in the point of sale you already run.* SUBHEAD, `--act1-text-2`, max 46ch |
| **Overheard** | See below. The best thing on this page. |
| CTA | `Get a demo` solid orange, Ink text. Beside it `See how it works` as an underlined text link in `--act1-text`. |
| Scroll cue | Bottom centre. A `1px` vertical rule `28px` tall with a `6px` segment travelling down it on a `1.8s` loop, plus `SCROLL` in Label at `--act1-text-2` 60%. |

### The overheard lines — build this properly

You are looking **down into a room full of people ordering.** So you hear them.

Beneath the subhead, in **Instrument Serif italic** at OVERHEARD scale, `--act1-text-2`, one line at a time, cross-fading every `3.4s` with a `520ms` overlap:

```
"Something spicy, but not too heavy. What do you have?"
"Is this gluten free?"
"Can we get that without onions?"
"What do you recommend?"
"Actually, make that two."
```

Preceded by a small Label line: `WHAT GUESTS ARE SAYING RIGHT NOW`

The first quote is the brand kit's own sanctioned guest line. This device does four things at once: brand-compliant (serif italic is for conversation), thematically exact (those words come from the tables you are looking at), it explains the product before a single feature is named, and no template produces it. **Fixed-height container** measured to the longest line so nothing reflows.

### The scroll — pinned `130vh`, scrubbed

| Progress | What happens |
|---|---|
| `0` | Load state. Mark draws. Display words mask up from below, SplitText by word, `80ms` stagger, `power4.out`, `1.1s`. Subhead and CTA fade up `+320ms`. Overheard loop begins. Video plays. |
| `0 → 0.55` | Video `scale 1.02 → 1.10`, linear. Type block `y: 0 → -60px`, `opacity 1 → 0.85`. Slow, almost imperceptible. The room draws you in. |
| `0.55 → 0.80` | Type block `y → -140px`, `opacity → 0`, staggered by line so it leaves in the order it arrived. Scroll cue gone by `0.6`. |
| `0.80 → 1` | **The turn (§8.3).** |

**Mobile:** no pin, no scrub. `100svh`, `hero-mobile.webm`, static `scale(1.04)`. Type stacks with tighter leading. Overheard still rotates. On scroll out, a single `600ms` fade. Everything readable at 360px.

**Reduced motion:** poster `<img>`, no video mounted, all type at final position and opacity, overheard shows line one only, no pin, no scrub.

## §8.3 `THE TURN` — the transition, tail of the same pin
### The most important 20% of scroll on the page

Four things happen simultaneously over progress `0.80 → 1`:

1. **The room goes dark.** An `--act1-bg` overlay above the video, `opacity 0 → 1`, `ease: 'none'`. The video keeps playing underneath for two more seconds, then the observer pauses it.
2. **The paper arrives.** Act III's surface wipes up from the bottom edge via `clipPath: inset(100% 0 0 0)` → `inset(0% 0 0 0)`. Not a fade. A wipe, like a page being laid down.
3. **The printer starts.** The ticket spine's paper strip feeds in from the top of the left gutter, `scaleY: 0 → 1`, `transform-origin: top`, `600ms`, `power2.out`. The first line prints: `TABLE 12      7:42`.
4. **The nav lands.** Gains its surface fill, hairline border, and the centre links fade up at `70ms` stagger.

Then the pin releases and normal scroll resumes.

**One line of type sits in the middle of the turn**, arriving at `0.86` and leaving at `0.98`, Display scale, centred, on the darkening plate:

> **Scan, speak, done.**

The brand's own three-word compression of the product. It is the bridge between cinema and explanation, and it is the **only centred display type on the entire page**. That is deliberate: it is a title card.

**Mobile:** simplified. The overlay darkens, the paper wipes up, the mobile progress rail appears. `Scan, speak, done.` shows on its own for `800ms` on an `onEnter`, not scrubbed.

---

## ACT III — THE EXPLANATION

## §8.4 `THE GUEST` — the playable demo
### Answers: show me. What does my guest actually do?

`--surface`. This comes first in Act III because the fastest way to explain the product is to run it.

Skeleton: Label `HOW IT WORKS FOR A GUEST` · Headline **A conversation, not a form.** · one subhead · the phone.

Asymmetric: phone right at roughly 44%, rotated `-3deg`, entering with `y: 80px → 0` and `rotate: -8deg → -3deg`, `950ms`. Copy left. The phone overlaps the section boundary below by `~70px`.

**Chrome:** real device proportions ~9:19.5, `1px` bezel gradient, `12px` inner screen radius, a soft **contact** shadow. Not a floating drop shadow.

**Screen:** header `Saffron House · Table 12`, segmented control `Menu | Chat | Voice`, the mode surface, a cart strip with a total.

**All guest and Orderly conversation text is Instrument Serif italic.** Prices, buttons, tabs and totals stay Hanken. This is what makes the conversation read as human rather than as UI, and it echoes Act I's overheard lines: the same voice, now inside the product.

**The §6.3 caption line sits directly beneath the phone.**

### Menu data — `lib/menu.ts`

```ts
export type Dish = {
  id: string
  name: string
  price: number
  tags: readonly string[]
  note: string
}

export const MENU: readonly Dish[] = [
  { id: 'butter-chicken', name: 'Butter Chicken',  price: 12.95, tags: ['bestseller', 'rich'],       note: 'slow cooked, mild heat' },
  { id: 'rogan-josh',     name: 'Lamb Rogan Josh', price: 14.95, tags: ['bestseller', 'spicy'],      note: 'Kashmiri chillies' },
  { id: 'malai-kofta',    name: 'Malai Kofta',     price: 11.50, tags: ['mild', 'vegetarian'],       note: 'cashew cream, no heat' },
  { id: 'paneer-tikka',   name: 'Paneer Tikka',    price: 10.95, tags: ['vegetarian', 'glutenfree'], note: 'charred, off the tandoor' },
  { id: 'dal-makhani',    name: 'Dal Makhani',     price: 9.50,  tags: ['vegetarian', 'mild'],       note: 'black lentils, overnight' },
  { id: 'garlic-naan',    name: 'Garlic Naan',     price: 3.50,  tags: ['side'],                     note: 'blistered, brushed with ghee' },
  { id: 'mango-lassi',    name: 'Mango Lassi',     price: 4.50,  tags: ['drink'],                    note: 'thick, house made' },
  { id: 'coke',           name: 'Coke',            price: 2.50,  tags: ['drink'],                    note: 'chilled can' },
  { id: 'gulab-jamun',    name: 'Gulab Jamun',     price: 5.50,  tags: ['dessert'],                  note: 'warm, in syrup' },
] as const
```

### Auto-loop, ~22s, then it hands control over

| Beat | Duration | What happens |
|---|---|---|
| **Menu** | 2.5s | Dish grid scrolling slowly. `Butter Chicken` tapped, press-scale `0.97` and back. Cart `$12.95`. |
| **Conversation** | 9s | Guest types *"what are your best sellers?"* Typing indicator 600ms. Orderly replies with two dish cards, `Butter Chicken` flagged `MOST ORDERED`, plus `Lamb Rogan Josh`. Guest types *"something mildly spiced for my mom"*. Indicator. Orderly returns `Malai Kofta` with a `Mild` chip and an `Add` button. **The Add button presses itself.** Cart `$24.45`. |
| **Voice** | 4s | Mic goes live. A `20px` bar strip animates **inside the screen only**, driven by a speech-envelope state machine: talk bursts `0.8–2.2s`, pauses `0.35–0.9s`. **Not a uniform sine wave. That is the tell.** Transcript types *"and a mango lassi"*. Cart `$28.95`. |
| **Upsell** | 2s | One suggestion slides up: *"Garlic naan with that? It goes with the butter chicken."* One tap. Cart `$32.45`. **This is the +23% claim, shown rather than asserted.** |
| **Pay** | 2s | A pay sheet rises from the screen bottom. `Pay $32.45`. A press, a Basil checkmark draws in, `Paid` in Label. |
| **Route** | 1.5s | Sheet retracts. `SENT TO TOAST` stamps in, Label style, Basil, rotated `-6deg`, `elastic.out(1, 0.45)`. |
| **Handoff** | — | Input activates. Placeholder *"Ask for a recommendation"*. Caption switches to `LIVE DEMO. TYPE ANYTHING`. Cursor blinks. |

Arithmetic: `12.95 + 11.50 + 4.50 + 3.50 = 32.45`. Assert it in code with a comment and verify at step 9.

### The demo brain — `lib/demo-brain.ts`

**Scripted and deterministic. No API, no key, no backend, no network.**

```ts
export type Intent =
  | 'recommend' | 'spicy' | 'mild' | 'vegetarian' | 'glutenfree'
  | 'drink' | 'dessert' | 'price' | 'allergy' | 'modify' | 'pay'
  | 'greet' | 'fallback'

export type Reply = {
  text: string
  dishes?: readonly Dish[]
  chip?: string
}

export function respond(input: string): Reply
```

Keyword sets per intent, checked in priority order: allergy before vegetarian, mild before recommend. Normalise: lowercase, strip punctuation, collapse whitespace, cap at 200 chars for matching.

**Voice: a great host. Confident, brief, genuinely helpful. Sentence case. No exclamation marks. No em dashes.**

```
recommend  → "Butter chicken goes out more than anything else on the menu.
              The rogan josh if you want heat."
glutenfree → "Paneer tikka is naturally gluten free, and the dal makhani.
              I would skip the naan. I can bring rice instead."
allergy    → "Tell me what to avoid and I will only show you what is safe."
mild       → "Malai kofta has no heat at all. Cashew cream, very gentle."
pay        → "I can take payment right here when you are ready."
fallback   → "I can help with that at the table. For the demo, try asking for
              a recommendation, something vegetarian, or a drink."
```

**Rules**
- Fake a `400–700ms` thinking delay behind the indicator, randomised in that band.
- Replies render through the **same components** the auto-loop used. No second code path.
- Empty or whitespace-only input: do nothing, no error.
- Over 200 characters: accept, truncate the echo at 120 with an ellipsis, respond via fallback.
- Gibberish: fallback. Never an error state, never "I don't understand."
- Auto-scroll to newest, `260ms`, ease-out.
- `Enter` sends. Visible focus ring. `aria-live="polite"` on the thread. Labelled input.

## §8.5 `WHAT WE ARE NOT` — pinned `120vh`
### Answers: is this going to replace my POS or my staff?

**The operator's biggest unspoken fear, answered by direct contrast.** Full-bleed `--ink` in both themes.

Label `WHERE ORDERLY SITS` · Headline **Orderly works with what you already run.** · Subhead *It sits on top of your operation. It does not replace your point of sale, your kiosks, or your people.*

Two columns. Left `WE ARE`, right `WE ARE NOT`. Four items each, verbatim from §1.1.

**Scrubbed.** Four pairs resolve one at a time, `0.25` of progress each:

1. The `WE ARE NOT` item sits fully visible at `--text-2`.
2. A `1px` rule **draws through it** left to right via `stroke-dashoffset`, `320ms`. The item drops to 40% opacity.
3. Simultaneously the `WE ARE` item opposite **masks up** from below into full Oat, and a small Basil check draws beside it, `220ms`.

By the end, the right column is struck through and dim, the left is bright and checked. **The section physically performs "enhance, never replace."**

Hold `0.1` of progress on the fourth pair, *"Sci fi. No robots, no glowing brains, ever."*, before releasing. That is the page telling an operator it will not embarrass them.

**One orange accent: none.** The only section on the page with no orange at all, which is what makes the orange in §8.12 land.

**Mobile:** no pin. Pairs stack, `WE ARE NOT` above `WE ARE`, each resolving on its own `onEnter`.

## §8.6 `FOUR WAYS IN` — expanding panels
### Answers: what if my guests hate talking to machines?

`--surface`. The grid breaks here: content shifts to an 8-column offset hanging right.

Label `EVERY GUEST, THEIR WAY` · Headline **Four ways in. Your guests pick.** · Subhead *Nobody is forced to talk to anything. Same page, same order, whichever way they choose.*

Four **vertical panels side by side**, `62vh`. At rest each `flex: 1`. Active expands to `flex: 2.4`, others compress. Hover on desktop, scroll position on tablet.

- Expanded: full copy plus a live mini-animation.
- Collapsed: a Label title only, `writing-mode: vertical-rl`, reading bottom to top.
- `450ms` on the interaction easing. **Origin aware:** grows from the edge the cursor entered. **Interruptible:** re-hovering retargets, never queues.

| Panel | Copy, verbatim | Mini-animation |
|---|---|---|
| **Chat Mode** | A seamless text alternative through the same interface. | Two Instrument Serif italic bubbles type in and out, 4s loop |
| **Browse Menu** | Photos, prices and every modifier in one place. | A dish list scrolls, one row highlighting on a cycle |
| **Voice Ordering** | Guests speak naturally. Every order lands perfectly. | The `20px` bar strip, speech-envelope timing |
| **Intelligent Upselling** | More of what guests love, at the right moment. | A suggestion chip slides in, total ticks `$28.95 → $32.45` |

**One orange accent:** the active panel's Label title.

**Mobile:** stack vertically, `auto` height, all expanded, each animation on its own `onEnter`. Keyboard: arrow keys move the active panel, `Tab` reaches each.

## §8.7 `THE NUMBERS`
### Answers: does it make me money?

`--surface`, `--sp-tight`. **Leads with outcomes, the brand's first voice principle.**

Three figures laid out asymmetrically, not an even three-column row: the first larger and left, the other two stacked right.

| Figure | Caption | Animation |
|---|---|---|
| `+23%` | average order value with conversational ordering | Counts up `1.4s`, `power4.out`, tabular |
| `2.4x` | faster than a counter | Counts up, `120ms` behind |
| `0` | apps to download | **Does not count. Snaps in** with a `120ms` scale from `1.4`. That is the joke and it is the best number on the page. |

Beneath, a Label row of verified figures: `130+ CLIENTS · 98% ORDER ACCURACY · UNDER 300MS RESPONSE · 0 DROPPED ORDERS`.

**One orange accent:** the `+23%` figure only.

## §8.8 Full-bleed video break — the one sanctioned scrim treatment

Edge to edge, `0px` radius, `48vh` desktop / `34vh` mobile. `break.webm` / `break.mp4`, `object-fit: cover`, poster `break-poster.jpg`. Same markup rules as §3.2. Parallax `y: -8%` across the scroll. No zoom.

An ink gradient scrim from the bottom, `rgba(32,26,22,0.85)` to transparent at 60%, per the brand kit's photography rule. Over it, one line in Oat at Headline scale, bottom-left in the gutter:

> **Every table, every night.**

The footage is a warm full room at service. Mean luma 34.5, so the scrim does real work here. **Verify white type reaches 4.5:1 over the actual bottom third, not the frame average.**

This is the only place in Act III where text sits on footage. It is sanctioned because the brand kit prescribes exactly this treatment for section breaks.

## §8.9 `ONE ORDER, END TO END` — the motion path
### Answers: where does the order actually go? Do I change anything?

**The second big animated idea.**

A single `1px` SVG path snakes down the section: left, across, down, back across, down. Four nodes along it. A small receipt element **rides the path**, scrubbed by scroll, via `MotionPathPlugin` with `autoRotate: true` so it banks into the curves.

**The section headline runs past the right viewport edge and is clipped.** No fade, no mask. The mandated rule-break.

| Node | Title | Line | Fires on arrival, `once: true` |
|---|---|---|---|
| 1 | `THE GUEST` | A QR on the table. No app, no sign up. | QR draws itself: three finder squares stroke-drawn with DrawSVG, `800ms`, `150ms` apart, then a 13×13 module grid fades in from random order, `12ms` each |
| 2 | `ORDERLY` | Every question answered, every customization captured. | Chips `no onions`, `extra cheese`, `make it mild`, `gluten free` fly in and **snap onto their line items**, `back.out(2.2)`, `160ms` stagger |
| 3 | `YOUR POS` | Toast, Square, Clover or Shift4. The one you already run. | Four outlined pills dock in sequence with slight overshoot. `Toast` fills orange, a hairline connects onward |
| 4 | `THE KITCHEN` | A clean ticket, same as any other. | A printer feeds a white ticket downward, `scaleY` from origin top, perforated edges, then `FIRED` stamps in Basil rotated `9deg`, `elastic.out(1, 0.4)`, plus a 3-cycle `3px` shake |

In the left margin between nodes 3 and 4:

**We don't replace your system. We amplify it.**
*Orderly plugs into your existing point of sale with no new hardware. Every order flows from the guest to the kitchen just as it should.*

**One orange accent:** the `Toast` pill fill at node 3.

**This is the hardest piece in the brief. Budget accordingly.** If the receipt judders rather than banking cleanly, the fix is a **simpler path with fewer control points**, not more code and not more easing.

**Mobile:** no MotionPath, no scrub. A straight vertical `1px` line down the left edge, drawn with `scaleY` on scroll. Four nodes stacked. Same four animations on `onEnter`.

## §8.10 `EVERY ORDER DRIVES VALUE`
### Answers: what is in it for me, my staff, my guests?

`--surface`. Grid returns to 12 columns.

Label `WHO FEELS IT` · Headline **Every order now drives value.** · Subhead *AI turns each conversation into a cleaner ticket, a more relevant recommendation, and a better experience for everyone at the table.*

Three blocks, **not a card row.** Each a full-width horizontal band on `--surface-2`, stacked at `--sp-none` so they read as one object divided by hairlines. Label left, Headline centre, a live detail right.

| Label | Headline | Live detail |
|---|---|---|
| `FOR OPERATORS` | Stop bleeding money at the table. | Ticket average ticking `$28.95 → $32.45` |
| `FOR STAFF` | Make room for real hospitality. | A small floor plan, table dots going orange (needs attention) to Basil (handled), one at a time |
| `FOR GUESTS` | Order instantly, exactly how they want. | Three Instrument Serif italic fragments cross-fading: *"no onions"* / *"is this gluten free?"* / *"what do you recommend?"* |

Each band slides in from alternating sides, `-40px`, `+40px`, `-40px`, preceded by a hairline drawing across its full width, `600ms`.

**One orange accent:** the ticket average figure in band one.

## §8.11 `STRAIGHT ANSWERS` — the accordion
### Answers: the seven things I am actually worried about.

`--surface`, deliberately quiet. No photos, no cards, no icons. Type, rules, one motion idea. This is the rest between the motion path and the orange flood.

Label `BEFORE YOU ASK` · Headline **The questions every operator asks us.** · Subhead *Short answers. Ask us anything else on the demo call.*

Seven rows. Label-style row numbers in the left gutter, hairline rules between, one open by default. Expand animates a wrapper's `grid-template-rows: 0fr → 1fr` — **no `max-height` hacks** — and rotates a `+` to `×`.

1. **Will my older guests actually use this?**
   They browse the menu like any other web page. Voice and conversation are there if they want them. No app, no account, no sign up.
2. **Does this replace my servers?**
   No. It takes the order so your staff can run the floor. Most operators tell us their team spends the saved time on tables that actually need them.
3. **What if my Wi-Fi drops?**
   Guests order on their own cellular data. Orderly only needs a connection at the POS end, and orders queue and send the moment it is back.
4. **Do I need new hardware?**
   No. Print the QR codes and you are running. Orderly plugs into the point of sale you already use: Toast, Square, Clover, or Shift4.
5. **How long does setup take?**
   Under a week, and most of that is us building your menu properly so every modifier is right.
6. **What happens if it mishears someone?**
   The guest sees every item on screen before they send it, and they can edit any line. That is why 98% accuracy shows up on the ticket, not just in a lab.
7. **What does it cost?**
   It depends on your covers and locations. We will quote you on the demo call.

Right column, sticky beside the accordion: a small `--ink` card. *Still have a question?* with a `Get a demo` button and the Label line `TYPICAL REPLY UNDER 2 HOURS`.

**One orange accent:** the open row's `×`.

Keyboard: each header is a `<button>` with `aria-expanded` and `aria-controls`. Full arrow-key navigation.

## §8.12 `WHAT THEY SAID` — orange, pinned `180vh`
### Answers: do real people say this, or just the sales page?

Full-bleed `--orange`. **One of only two full-orange moments and where the 8% budget is spent.**

**Contrast rule:** white on orange only at 18px bold and above. The quotes are Display scale so white works. **Every Label and attribution on orange must be Ink**, not white.

Headline in white: **Trusted by restaurants and diners that care about every table.**

The three real quotes, **one at a time, large, in Instrument Serif italic**, filling the section. Scrubbed: each fades and lifts out at `y: -30px` as the next lifts in from `y: 30px`, attribution swapping in Ink Label style. A `1/3 · 2/3 · 3/3` readout bottom right in Ink.

Display scale, `1.32` leading, `24ch` max so line breaks land well.

> "It was a lot like talking to a server. It was very similar to a waitress. We didn't have a waitress around, so it was really cool. We were able to immediately ask the questions we wanted to ask and get recommendations."
> — Orange Square diner

> "I have gluten intolerance and I don't eat red meat. There was no way I was going to be able to order from that menu without talking to somebody. It would have taken me probably 20 minutes longer."
> — Orange Square diner

> "Before, pickup was just a phone number, and it confused customers all the time. Orderly makes it so easy. Even better, we're seeing ticket sizes grow."
> — Grace, Orange Square operator

**The gluten intolerance quote is the most persuasive sentence the client owns.** It earns a full section.

**Mobile:** no pin. Three stacked blocks, each revealing on `onEnter`.

## §8.13 `WHAT'S NEXT`

`--surface-2`, `--sp-tight`. Label `GUEST PLATFORM. COMING SOON` · Headline **From one great meal to the next favorite table.**

Copy: *Orderly will turn every dine-in moment into a reason to return. Guests can save favorites, discover new restaurants, and earn rewards through the ordering experience they already love.*

(The client's original line used "unlock," which §5.3 bans. Rewritten to "earn." Flag it in your report.)

Left: a phone showing a rewards screen, `320 points`, a favorites row, recommended-for-you cards. Three floating Label chips `Discover`, `Rewards`, `Favorites` parallaxing at `y: -60`, `-38`, `-22`.

**One orange accent:** the `320` figure.

## §8.14 `LAST CALL` — orange, the demo form
### Answers: how do I start, and how long does it take?

Full-bleed `--orange`. The second and final orange moment.

Left: **Ready to perfect your dine-in experience?** Display, white. Subhead: *Let's make every table faster, calmer and easier to serve.*

Right, a working form. **All labels and error text in Ink**, per the contrast rule.

| Field | Type | Required |
|---|---|---|
| Name | text | yes |
| Restaurant name | text | yes |
| Number of locations | number, min 1 | yes |
| Current POS | select: Toast / Square / Clover / Shift4 / Other | yes |
| Work email | email | yes |

Ink-outlined inputs, `4px` radius, floating Label captions rising on focus `160ms`. Validation on blur and on submit. Errors in the host's voice:

- *We need a work email to route your demo.*
- *Which POS are you on? It changes how we set you up.*
- *How many locations? Even a rough number helps.*

Microcopy: *By submitting, you agree to be contacted about Orderly.*

Beneath, two Figures in white: `24/7` *support ready for you* and `Under 1 week` *implementation*. **These answer the "how long" half. Give them weight, not footnote treatment.**

On valid submit: the button morphs to a Basil checkmark `220ms`, Sonner fires a toast, and a Label line types in beneath: `DEMO REQUESTED. WE WILL BE IN TOUCH.`

**No backend.** `preventDefault`, validate, set success state. Never post anywhere. Never fake a network delay over 600ms.

**Mobile:** a sticky `Get a demo` opens the form in a **Vaul bottom sheet**. Cramped inputs inside a full-bleed colour section is a real UX failure and the sheet is the fix. Test with the on-screen keyboard open.

## §8.15 `CLOSE` — footer

`--ink` full-bleed, Oat type.

The mark in white, then the wordmark, then the master tagline at Headline scale: **Keep your restaurant Orderly.**

Two link columns.
**Product** — How it works · For operators · FAQs · Docs · News
**Legal** — Privacy policy · Terms of service · Delete my data · Contact

Then a giant `Orderly` wordmark clipped by the bottom edge of the viewport, in `--surface-2` at low opacity so it reads as texture rather than a second headline.

`© 2026 Orderly` · `brand@orderly.com`

**The closing beat:** as this section enters, the ticket spine completes and `FIRED` stamps onto it in Basil, `elastic.out(1, 0.4)`, rotated `-7deg`, with the Label line `SERVICE COMPLETE` beside it. **That is the payoff for the entire scroll. Get it right.**

**One orange accent:** the mark. Nothing else.

## §8.16 Persistent element

A floating pill, bottom centre, appearing after Act I ends: `See Orderly in action` + `Try it live`. Ink pill, Oat text, one small orange dot. `y: 40px → 0`, `420ms`. Magnetic on hover, desktop only. Clicking scrolls to §8.4 via ScrollToPlugin with `offsetY` equal to nav height. Dismissible with a small `×` that persists in `sessionStorage`.

---

# §9 · ANIMATION INVENTORY — 38 MOMENTS

Heavily animated means **many specific moments**, not one generic effect everywhere. Uniform fade-up-on-scroll is the laziest possible motion and the fastest tell.

Every moment is listed so the count is accountable. If you add one not on this list, justify it. If you cannot, do not add it.

| # | Moment | § | Type |
|---|---|---|---|
| 1 | Logo mark stroke-draws | 8.2 | DrawSVG, once ever |
| 2 | Display words mask up | 8.2 | SplitText |
| 3 | Subhead + CTA fade up | 8.2 | opacity |
| 4 | **Overheard lines cross-fade, 5 states** | 8.2 | loop |
| 5 | Scroll cue segment travels | 8.2 | loop |
| 6 | **Video scrubbed push, 1.02 to 1.10** | 8.2 | scrubbed |
| 7 | Type block scrubbed exit, staggered by line | 8.2 | scrubbed |
| 8 | **The room darkens** | 8.3 | scrubbed |
| 9 | **Paper wipes up, clipPath** | 8.3 | scrubbed |
| 10 | **Ticket spine feeds in** | 8.3 | scaleY |
| 11 | Nav gains surface + links fade in | 8.3 | stagger |
| 12 | `Scan, speak, done.` title card | 8.3 | scrubbed |
| 13 | Ticket spine grows with scroll | 7 | scrubbed |
| 14 | Ticket lines print, 12 of them | 7 | char reveal, once |
| 15 | Phone enters with rotate settle | 8.4 | transform |
| 16 | Demo: menu tap press | 8.4 | interaction |
| 17 | Demo: conversation typing | 8.4 | char reveal |
| 18 | Demo: dish cards spring in | 8.4 | back.out |
| 19 | Demo: Add button self-press | 8.4 | interaction |
| 20 | Demo: voice bars, speech envelope | 8.4 | rAF canvas |
| 21 | Demo: upsell chip rise | 8.4 | transform |
| 22 | Demo: pay sheet + Basil check draw | 8.4 | DrawSVG |
| 23 | Demo: SENT TO TOAST stamp | 8.4 | elastic |
| 24 | **Demo captions, 8 states** | 6.3 | opacity |
| 25 | **We-are-not: strike-through + check, 4 pairs** | 8.5 | scrubbed, pinned |
| 26 | Four panels expand and compress | 8.6 | interaction |
| 27 | Four panel mini-loops | 8.6 | loop |
| 28 | Three figures count up, the 0 snaps | 8.7 | count |
| 29 | Video break parallax | 8.8 | scrubbed |
| 30 | **Receipt rides the MotionPath** | 8.9 | scrubbed, autoRotate |
| 31 | Node 1: QR draws | 8.9 | DrawSVG, once |
| 32 | Node 2: modifier chips snap | 8.9 | back.out, once |
| 33 | Node 3: POS pills dock | 8.9 | overshoot, once |
| 34 | Node 4: printer + FIRED stamp | 8.9 | elastic, once |
| 35 | Three value bands, alternating slide + rule draw | 8.10 | once |
| 36 | Accordion grid-template-rows | 8.11 | interaction |
| 37 | **Quote scrub, 3 states** | 8.12 | scrubbed, pinned |
| 38 | **FIRED + SERVICE COMPLETE payoff** | 8.15 | elastic, once |

**Pin budget: exactly three.** §8.2 plus §8.3 as one pin at `130vh`, §8.5 at `120vh`, §8.12 at `180vh`. No fourth. Past three the page fights the reader and Core Web Vitals suffer.

---

# §10 · MOTION SYSTEM — TWO BUDGETS

Two distinct layers, different timing. **Do not average them.** This is where most builds fail.

## §10.1 Interaction layer — Emil's rules are law

```
Duration   150–250ms. Never over 300ms.
Easing     ease-out entering, ease-in exiting.
           NEVER ease-in on something appearing. NEVER linear on a UI transition.
Feel       Spring for anything manipulated directly: the theme knob, panel
           expansion, magnetic buttons.
Behaviour  Interruptible. Re-triggering retargets, never queues.
           Origin aware. Grows from the edge that was touched.
           Never animate the focus ring itself.
           Disabled elements do not animate at all.
```

Applies to moments 16, 19, 26, 36 plus buttons, the theme toggle, nav compression, form inputs, the Vaul drawer and sheet, the Sonner toast, hover states, the magnetic effect.

**Run `review-animations` against this layer and fix everything it finds.**

## §10.2 Narrative layer — scroll and choreography

```
Duration   600–950ms reveals. 1.1s the Act I display.
Easing     CustomEase 'shift' = cubic-bezier(0.22, 1, 0.36, 1)
           elastic.out(1, 0.45) for stamps and chips ONLY
           'none' for anything scrubbed
Stagger    60–80ms
Firing     once: true on every reveal. Nothing re-animates on scroll-up.
           The single most recognisable template tell.
```

Applies to every other moment in §9.

**Do not let `review-animations` shorten these.** Its 300ms ceiling is calibrated for buttons. Applied to a scrubbed camera push it produces something cheap and twitchy. If it flags them, ignore it and note the disagreement in your report.

## §10.3 Global rules

```
Properties  transform and opacity only.
            Permitted exceptions, nothing else:
              · ticket spine height, scrubbed and composited
              · flex-grow in §8.6
              · grid-template-rows in §8.11
              · SVG stroke-dashoffset for line draws
              · clipPath inset in §8.3
            NEVER: width, height, top, left, margin, filter, box-shadow,
            background-position.
```

- **Lenis** at `lerp: 0.09`. Wire via `lenis.on('scroll', ScrollTrigger.update)`, drive from `gsap.ticker`, and set `gsap.ticker.lagSmoothing(0)`. **Destroy Lenis entirely under `prefers-reduced-motion`.**
- Every pinned or desktop-only pattern inside `gsap.matchMedia()` with `(min-width: 1024px)` and an **explicit** mobile alternative. No exceptions.
- Custom cursor and magnetic buttons behind `(hover: hover) and (pointer: fine)`.
- `will-change` only while animating, removed after.
- `ScrollTrigger.refresh()` after `document.fonts.ready`, on `load`, and `50ms` after any theme change.

## §10.4 Reduced motion — a complete page, not a broken one

- Lenis destroyed. Native scroll. No pins, no scrubs.
- Act I: poster `<img>`, no video mounted, all type at final position, overheard shows line one only.
- The turn: Act III's surface is simply already there. Spine drawn complete with every line printed and `FIRED` stamped.
- Demo shows its **completed** state: full cart, `$32.45`, `Paid`, `SENT TO TOAST`. **The interactive input still works** and the caption shows the final line.
- §8.5 all four pairs already resolved. §8.6 all panels expanded, static. §8.9 a static diagram with all four node states finished. §8.12 quotes stacked.
- Voice bar strip renders one static frame.

**The §6.2 headline-only test must still pass in this mode.** That is the real test of whether meaning lives in the copy or only in the motion.

---

# §11 · RESPONSIVE

```
360   floor. Must work perfectly.
390   iPhone reference
768   tablet portrait
1024  desktop threshold. Pins activate.
1280  ticket spine gutter appears
1440  primary design target
1920  must not look empty
```

| Desktop | `< 900px` |
|---|---|
| Act I pinned `130vh` with scrub | `100svh`, `hero-mobile.webm`, static scale, single fade out |
| The turn, scrubbed | Simplified: overlay darkens, paper wipes, title card on `onEnter` |
| Ticket spine, 96px gutter | `2px` progress rail at the left viewport edge with tick marks |
| §8.5 pinned pairs | Stacked pairs, each on its own `onEnter` |
| §8.6 expanding panels | Stacked, `auto` height, all expanded |
| §8.9 MotionPath | Vertical `1px` line, `scaleY` draw, four stacked nodes |
| §8.12 pinned quote scrub | Three stacked blocks |
| Nav links inline | Vaul drawer from top |
| §8.14 form beside headline | Vaul bottom sheet from a sticky trigger |
| Cursor, magnetic | Disabled via `(pointer: fine)` |

**Non-negotiables**
- `100svh` / `100dvh`, never `100vh`. Mobile browser chrome will break it.
- Touch targets `44×44px` minimum, including the theme toggle and every nav link.
- No horizontal overflow at any width. Verify `document.documentElement.scrollWidth === clientWidth`.
- Body type never below 16px. Labels never below 12px.
- **Act I must be fully readable at 360px** with the video behind it. If the Display wraps to five lines, reduce the clamp minimum. Do not go below `2.2rem`.
- **The demo caption must be legible at 360px.** If it wraps to three lines, shorten the caption text. Do not shrink the type.

---

# §12 · CONTENT — VERBATIM. INVENT NOTHING.

| Slot | Copy |
|---|---|
| Label | AI ORDERING FOR MODERN HOSPITALITY |
| Act I Display | The best employee your restaurant has ever had. |
| Turn title card | Scan, speak, done. |
| Master tagline | Keep your restaurant Orderly |
| Value | Every order now drives value. |
| Value sub | AI turns each conversation into a cleaner ticket, a more relevant recommendation, and a better experience for everyone at the table. |
| POS | We don't replace your system. We amplify it. |
| POS sub | Orderly plugs into your existing POS with no new hardware required. Every order flows from the table to the kitchen just as it should. |
| Testimonials | Trusted by restaurants and diners that care about every table. |
| Guest platform | From one great meal to the next favorite table. |
| Final CTA | Ready to perfect your dine-in experience? |
| Final sub | Let's make every table faster, calmer and easier to serve. |

**Verified figures:** `+23%` average order value · `2.4x` faster than counter · `0` apps to download · `130+` clients · `98%` order accuracy · `under 300ms` response · `0` dropped orders · `24/7` support · `under 1 week` implementation

**POS:** Shift4, Toast, Square, Clover.

**Do not invent** statistics, testimonials, customer names, or prices beyond the demo menu. **Do not add an investor logo row:** I have not verified those marks are cleared for use.

---

# §13 · FILE STRUCTURE

```
app/
  layout.tsx           fonts, theme script, metadata, Lenis provider
  page.tsx             composition only, zero logic
  globals.css          tokens, base, noise, reduced-motion
components/
  chrome/    Nav · ThemeToggle · TryLivePill · Cursor · Grain
  act1/      Room · HeroVideo · Overheard · ScrollCue
  act2/      Turn · TicketSpine · TicketSpineMobile
  sections/  Guest · WeAreNot · Modes · Numbers · VideoBreak
             Journey · Value · Answers · Quotes · Next · LastCall · Close
  demo/      Phone · PhoneScreen · ModeTabs · MenuGrid · ChatThread
             ChatInput · DishCard · VoiceBars · CartStrip · PaySheet
             DemoCaption      <- §6.3, do not skip
             useDemoLoop.ts   <- the 22s timeline
  primitives/ Button · Label · Rule · Figure · Ticket · Pip · PhotoSlot
lib/
  gsap.ts        plugin registration + CustomEase 'shift'
  useLenis.ts · useReducedMotion.ts · useTheme.ts · useInView.ts
  demo-brain.ts · menu.ts · cn.ts
  types.ts       shared types, no `any`
public/
  logo.svg
  video/  hero.webm hero.mp4 hero-mobile.webm hero-poster.jpg
          break.webm break.mp4 break-poster.jpg
```

**Every animation hook cleans up.** `gsap.context()` per component, `ctx.revert()` in the `useEffect` return. Kill timelines, kill ScrollTriggers, cancel rAF, disconnect observers. No `useEffect` without a cleanup where GSAP is involved.

---

# §14 · TYPESCRIPT AND DEPLOYABILITY — A HARD GATE

The build must deploy to Vercel with zero errors on the first try.

## §14.1 Rules

- **`npx tsc --noEmit` clean before every commit.** Not "mostly clean."
- **No `any`. No `@ts-ignore`. No `@ts-expect-error`.** If you need one, you have modelled something wrong. Fix the model.
- **No non-null assertions (`!`) on DOM refs.** Guard with `if (!ref.current) return`.
- Refs: `useRef<HTMLDivElement | null>(null)`, `useRef<HTMLVideoElement | null>(null)`. Always the union with null.
- Every component touching `window`, `document`, GSAP, Lenis, or `localStorage` is `'use client'`. `page.tsx` and `layout.tsx` stay server components.
- **No hydration mismatches.** Theme comes from the inline blocking script setting `data-theme` on `<html>`, read via CSS variables only. **Never render different markup on server versus client based on theme.** No `useState(getTheme())`.
- `Math.random()`, `Date.now()`, `performance.now()` never run during render. Only in effects or handlers. Randomised values that must be stable go in a `useRef` seeded in an effect.
- `as const` on all static data arrays, `readonly` on their types.
- Event handler types: `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>`. Never `any`.
- Video: `void ref.current?.play().catch(() => {})`. An unhandled rejection fails this gate.
- No unused imports or variables. `next lint` clean. No `console.log` in shipped code.

## §14.2 The gate

Run all three at steps 5, 10, 15 and 21, and report the output:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

**If `npm run build` fails, stop and fix it before writing another feature.** A broken build that accumulates three more sections becomes a rewrite.

## §14.3 Vercel

Nothing to configure. No env vars, no API routes, no server actions. It is a static marketing page with client-side interactivity. If you find yourself needing a server action, you have misread the brief.

Confirm at step 21: `npm run build` shows every route static and total First Load JS under 200 kB.

---

# §15 · QUALITY GATES

**Build and types**
- [ ] `npx tsc --noEmit` clean. Zero `any`, zero ignores, zero non-null assertions on refs.
- [ ] `npm run lint` clean. `npm run build` green. All routes static. First Load JS under 200 kB.
- [ ] Zero console errors, hydration warnings, React key warnings, unhandled promise rejections.
- [ ] No `useEffect` leaks. Navigate away and back: no duplicate ScrollTriggers.

**Video**
- [ ] Act I plays muted and inline on iOS Safari.
- [ ] Poster shows before load and under reduced motion, with no video element mounted.
- [ ] `hero-mobile.webm` served under 900px.
- [ ] Video pauses when Act I leaves the viewport.
- [ ] Renaming the video files leaves Act I fully readable and functional.

**Brand compliance**
- [ ] Every colour reads a §4.1 token. Grep for `#` and justify every hit.
- [ ] Proportions near Oat 60 / White 20 / Ink 12 / Orange 8.
- [ ] **One orange accent per section.** List all of them in the report.
- [ ] White on orange only at 18px bold and above. No orange text on peach.
- [ ] Two font families only. **No monospace anywhere. No serif display.**
- [ ] Instrument Serif italic only, and only for conversation and quotes.
- [ ] Logo: one colour, clear space, never below 24px, never transformed, animated only once in Act I.
- [ ] Sentence case everywhere except Label. **Zero em dashes in any shipped string, grep for them.** Zero exclamation marks. No headline over 12 words.

**Clarity**
- [ ] §6.2 headline-only test passes. Extracted list in the report.
- [ ] Every section names its §6.1 question.
- [ ] Demo captions present, changing per beat, legible at 360px.
- [ ] POS explained on first use. No §5.3 banned vocabulary in copy you wrote.
- [ ] Nothing important exists only inside an animation.

**Layout**
- [ ] **Ticket spine crosses zero content at 1280, 1366, 1440, 1920.** Screenshot each.
- [ ] No horizontal overflow at any of the seven breakpoints.
- [ ] 1920 not empty. 360 not cramped. Act I readable at 360.
- [ ] §8.9's clipped headline is clipped by the viewport, not by a container that also clips something else.

**Theme**
- [ ] Every section checked in both themes.
- [ ] No flash on toggle or reload.
- [ ] `ScrollTrigger.refresh()` after the swap.
- [ ] Ink on Oat ≥ 7:1 · Ink on orange ≥ 4.5:1 · Stone on Oat ≥ 4.5:1 · Oat on Ink ≥ 7:1 · Oat on the Act I plate ≥ 7:1 **measured on the actual frame**.

**Accessibility**
- [ ] Full keyboard traversal, visible focus ring, logical tab order.
- [ ] `prefers-reduced-motion` gives a complete readable page with Lenis destroyed and §6.2 still passing.
- [ ] Demo thread `aria-live="polite"`, input labelled.
- [ ] Accordion headers are buttons with `aria-expanded` and `aria-controls`.
- [ ] §8.6 panels keyboard operable. Form errors linked via `aria-describedby`.
- [ ] One `h1`, no skipped heading levels. Video `aria-hidden`.
- [ ] `prefers-contrast: more` does not break.

**Performance**
- [ ] Lighthouse mobile: Performance ≥ 88, Accessibility ≥ 95, Best Practices ≥ 95. (88 not 90: a hero video costs a few points and that is an accepted trade.)
- [ ] LCP under 2.5s. **The Act I Display text is the LCP element, not the video.**
- [ ] CLS < 0.05. `adjustFontFallback` on both families.
- [ ] 4× CPU throttle: no jank on any of the three pins or the motion path.

**Correctness**
- [ ] Demo handles empty, whitespace, 400-char and gibberish input.
- [ ] Auto-loop resets cleanly over 5 loops with no state accumulation.
- [ ] `12.95 + 11.50 + 4.50 + 3.50 = 32.45`.
- [ ] Form validates, succeeds, and posts nowhere.

**Design**
- [ ] Nothing matches any item in §5.1. Every §5.2 tell present and findable.
- [ ] All 38 §9 moments implemented, or the missing ones named in the report.
- [ ] Exactly three pins.

---

# §16 · BEFORE YOU WRITE ANY CODE

**1. Write the design plan.**
- Final token values, with the dark-mode derivation flagged as needing client approval
- The two-family type scale and what each voice speaks as
- ASCII wireframes of §8.2 at rest, §8.3 mid-turn, §8.5, and §8.9
- **Your one orange accent for every section, listed**
- One sentence naming the signature element and why it belongs to *this* subject
- **The §6.2 headline-only list exactly as you intend to write it.** Prove the page explains itself before you build it.

**2. Critique the plan against §5.**
Work out what you would produce for a generic SaaS landing page with this content. Wherever your plan lands in the same place, change it and say what you changed and why. Concretely: *"I was going to put the four modes in a 4-column card grid. That is §5.1, so they are now expanding panels."* Vague self-congratulation is not a critique.

**3. Then stop.** Write no code. Wait for my approval.

---

# §17 · BUILD ORDER — ONE STEP PER TURN

After every step: screenshot 1440×900 and 390×844 in both themes via Playwright, **read the images**, critique against §5, fix, confirm zero console errors, `git commit` with the step number, then stop and report. Never batch steps.

| # | Step | Gate |
|---|---|---|
| 1 | Verify §0. Both Google fonts, both token sets, theme script, Lenis + ScrollTrigger, `lib/gsap.ts` | Toggle works, no flash on reload, both faces rendering, `tsc` clean |
| 2 | **MotionPathPlugin smoke test**: a dot along a path | Works, or stop and report |
| 3 | Primitives: Button, Label, Rule, Figure, Ticket, Pip, PhotoSlot | Type scale exact per §4.4 in both themes |
| 4 | Act I static: video plate, scrim, all type, mark draw | **Readable at 1440 and 360. Contrast measured on the real frame, not assumed.** |
| 5 | Overheard rotation + scroll cue. **§14.2 GATE** | No reflow on the longest line. Build green. |
| 6 | Act I scrub: video push, type exit | Smooth, no jank at 4× throttle |
| 7 | **§8.3 the turn**: darken, paper wipe, spine feed, nav land, title card | **The most important 20% of the page. Pin releases with no jump and no dead scroll.** |
| 8 | Phone chrome, screen, tabs, DemoCaption | Proportions right, contact shadow, caption legible both themes |
| 9 | Demo auto-loop, 22s, all 8 captions | Loops clean, resets without leak, arithmetic correct |
| 10 | Demo brain + interactive handoff. **§14.2 GATE** | All four edge cases pass. Build green. |
| 11 | Ticket spine full: growth, all 12 print points, mobile rail | **Crosses zero content at 1280/1366/1440/1920. Screenshot each.** |
| 12 | §8.5 we-are-not — **second hardest piece** | All four pairs resolve, none skipped or double-fired, mobile stacks |
| 13 | §8.6 panels + §8.7 numbers | Interruptible, origin aware. The `0` snaps. |
| 14 | §8.8 video break. **CHECKPOINT: full-page read-through** | Scrim contrast measured on the bottom third. **Then scroll the whole page top to bottom and report honestly whether it feels like one authored experience or a stack of sections.** |
| 15 | §8.9 motion path — **hardest piece**. **§14.2 GATE** | Receipt banks cleanly, four nodes fire once, labels readable, mobile works. Build green. |
| 16 | §8.10 value bands + §8.11 accordion | Zero-gap stack reads as one object. Accordion keyboard operable. |
| 17 | §8.12 quotes + §8.13 next | Contrast rule respected, mobile unpins |
| 18 | §8.14 form + Vaul sheet + §8.15 close + `FIRED` payoff | Every error string correct. Sheet usable with keyboard open. Spine lands exactly at the end. |
| 19 | §8.16 pill + cursor + magnetic | Fine-pointer gated, dismissal persists |
| 20 | **Audit pass:** grep for `#`, grep for em dashes, list every orange accent, run the §6.2 headline test | All four reported in full |
| 21 | **Mobile pass** across all seven widths. **§14.2 GATE** | Every §11 equivalent works. Build green. First Load JS under 200 kB. |
| 22 | **Reduced motion** per §10.4, then a11y, then performance, then `review-animations` on the interaction layer only | Every §15 box ticked. Report findings applied and rejected. |

---

# §18 · WHEN YOU FINISH

Report:

1. What you built, section by section, one line each
2. Every §15 gate: passed or not, honestly
3. The screenshot matrix result across all seven widths, both themes
4. **The §6.2 extracted headline list, written out**
5. **Every orange accent, listed by section**
6. Any `PhotoSlot` positions and what images I need to supply
7. **Anything you know is not good enough yet**, named specifically
8. Which `review-animations` findings you applied and which you rejected as narrative-layer, with reasoning
9. Every flagged deviation: the dark-mode derivation, the "unlock" rewrite, the Chat-versus-conversation call
10. The one thing you removed at the end

---

# §19 · HOW TO WORK

**Never silently substitute.** No fallback fonts, no placeholder paths, no swapped libraries, no invented content, no "close enough" colours. If something is blocked, stop and say exactly what and why. A blocked step reported honestly costs one message. A silent substitution costs hours and may not be caught until launch.

**Report honestly.** "The MotionPath judders at 768px" is worth more to me than a green checklist. If you are unsure something is good, say so.

**Disagree up front.** If you think something here is wrong, say so before building it, not after.

**Watch your own drift.** This is a long build. If you catch yourself reaching for a card grid, a centred layout, a 16px radius, a gradient, orange as atmosphere, a serif headline, or uniform fade-up-on-scroll, that is §5 territory. Stop, re-read §5, and redo that piece.

**At the very end,** look at the finished page and find the element that is decoration rather than communication. Delete it. Tell me which one it was.