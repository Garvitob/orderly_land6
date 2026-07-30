# ORDERLY LANDING PAGE

**Full spec: `BRIEF.md` at the project root. Source of truth. Re-read the relevant
section immediately before building each part. Do not work from memory of it.**

Authority: brand kit > BRIEF.md > my messages > this file > skills > your defaults.

Setup is DONE. Do not run create-next-app. Do not install packages.

## Structure: three acts
ACT I  THE ROOM   dark, hero video, pinned 130vh. Four lines of type, one button.
ACT II THE TURN   tail of the same pin. Video darkens, receipt paper wipes up,
                  the ticket spine feeds in, the page becomes paper.
                  Title card: "Scan, speak, done."
ACT III EXPLAIN   paper, 12 beats, heavily animated. Spine prints a line per
                  section. Footer: FIRED stamps, SERVICE COMPLETE.

Act I is dark in BOTH themes. The turn is where light mode becomes Oat.

## Skills
Load: frontend-design, emil-design-eng, apple-design.
Step 22 only: review-animations, interaction layer ONLY.
NEVER load: pick-ui-library, prototype, find-animation-opportunities,
improve-animations.
A skill informs HOW. It never overrides WHAT the brief says to build.

## Colour, official brand values. Never hard-code a hex.
LIGHT "SERVICE" default:
--orange #FD6001 · --ink #201A16 · --oat #FAF6F0 · --white #FFFFFF
--peach #FFE7D6 · --stone #8C8177 · --basil #1E7A46 (success only)
surface=oat · surface-2=white · text=ink · text-2=stone · rule rgba(32,26,22,.10)

DARK "AFTER HOURS", derived, flag for client approval:
surface #201A16 · surface-2 #2A2320 · text #FAF6F0 · text-2 #8C8177
rule rgba(250,246,240,.12) · orange #FD6001 · orange-lift #FF7A2E · peach #3A2A20
basil #2E9C5C

ACT I, theme-invariant: --act1-bg #0C0A08 · --act1-text #FAF6F0
--act1-text-2 #C9C1B8

Proportions are a brand rule: Oat 60 / White 20 / Ink 12 / Orange 8.

## Orange discipline, the brand's own words
"Orange is the seasoning, not the dish: use it for the mark, key actions, and
ONE ACCENT PER LAYOUT."
One orange accent per section beyond the mark and CTA fills. Not two.
NO orange glows, shadows, gradients, hover borders, haze, dividers, focus rings.
White on orange ONLY at 18px bold and above. NEVER orange text on peach.
Need depth? Ink or Basil.

## Type, two families. Both from next/font/google.
Hanken Grotesk: all headlines, figures, body, interface. 700/800 headlines with
tight tracking, 400 body, 600 labels.
Instrument Serif ITALIC ONLY: guest quotes, the Act I overheard lines, every
chat bubble in the demo, dish names. Never body. Never UI.
NO MONOSPACE ANYWHERE. NO SERIF DISPLAY. Data/clock/ticket use Label style:
Hanken 600, 12px, +0.14em, uppercase, tabular-nums.
Max 12 words in a headline. text-wrap: balance on all display and headline.

## Video, already encoded in public/video. Do not re-encode.
hero.webm 432KB · hero.mp4 · hero-mobile.webm (under 900px) · hero-poster.jpg
break.webm · break.mp4 · break-poster.jpg
muted playsInline loop preload="metadata" poster aria-hidden. Never autoPlay prop.
void ref.current?.play().catch(() => {})
Reduced motion: poster <img>, no video mounted.
Camera push comes from GSAP scrub, scale 1.02 to 1.10. Never bake one in.
Never animate filter on video. Blur is in the file.

## Radius: 0 / 4 / 12 / 999px only.

## Copy style, hard rules
Sentence case everywhere except Label. Max 24 words per body sentence.
NO EXCLAMATION MARKS. NO EM DASHES IN ANY SHIPPED STRING. Numerals for metrics.
"guests" not "users". "conversation" not "chat", except the Chat product mode.
Banned: unlock, seamlessly, revolutionize, disrupt, game-changing,
next-generation, cutting edge, intelligence layer, leverage, streamline,
empower, elevate, supercharge, robust, frictionless, bot, chatbot.

## Banned, instant fail
Brand kit's own line: "Sci fi. No robots, no glowing brains, ever."
A ROW of dark photo cards with scrim + white text. One full-bleed break with a
scrim is allowed, at §8.8 only.
Icon-title-two-grey-lines grids. Bento. Everything centred.
Purple/indigo. Gradient mesh. Aurora blobs. Glassmorphism.
backdrop-filter on more than one element. Any colour outside the tokens.
Sparkle/robot/brain icons. Clip art. Anything glowing.
Serif headlines. Text shadows on type over footage, use a scrim.
Ambient waveform wallpaper, sound lives INSIDE the phone screen only.
Reveals re-firing on scroll-up. Animating filter or box-shadow.
UNIFORM FADE-UP-ON-SCROLL EVERYWHERE. More than 3 pins.

## Motion, two budgets. Never average them.
INTERACTION (buttons, theme knob, panels, hovers, form, drawer, toast):
150-250ms, ease-out, spring where directly manipulated, interruptible,
origin-aware.
NARRATIVE (video push, the turn, scroll reveals, 3 pinned scrubs, MotionPath,
count-ups, DrawSVG): 600-950ms, CustomEase 'shift' cubic-bezier(.22,1,.36,1),
once:true always.
review-animations applies to the FIRST list only. If it flags the second as too
slow, ignore it and say so.
transform + opacity only. Exactly 3 pins: Act I+turn 130vh, we-are-not 120vh,
quotes 180vh. 38 named moments in BRIEF.md §9.

## TypeScript, a hard gate
No any. No ts-ignore. No non-null assertions on refs.
useRef<HTMLElement | null>(null) always.
No hydration mismatch: theme via inline script + CSS vars only, never
useState(getTheme()).
Math.random / Date.now never during render.
`npx tsc --noEmit && npm run lint && npm run build` at steps 5, 10, 15, 21.
If build fails, stop and fix before writing another feature.

## Clarity is a gate, not a bonus
Every section answers one operator question (§6.1).
Headline-only test: strip to Display + Headline + Label + Figure. A stranger must
be able to explain Orderly from those words alone.
The demo caption line under the phone changes every beat. Not optional.
Nothing important may exist only inside an animation.
Section skeleton, every Act III section: LABEL / headline / one subhead / the
proof / one link. Vary the visual wildly, never the skeleton.

## After every build step
Playwright: screenshot 1440x900 and 390x844, both themes. READ the images.
Critique against §5. Fix before moving on. Zero console errors. git commit.
One §17 step per turn. Never batch.