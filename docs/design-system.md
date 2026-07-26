# Stonecrete Bricks design system v0.2

This file outranks any summary of it. Tokens live in `src/app/globals.css`.

## 1. The spine: restraint, photography, space

v0.1 drove the whole page off a literal running-bond grid, offsetting every other course by three columns, and decorated sections with a brick-pattern band. In review it read as busy and generic rather than considered: the offset looked like inconsistent margins, the pattern looked like filler, and a 100px headline with 0.86 leading shouted where it should have spoken.

v0.2 inverts the approach. **The presence comes from what is left out.**

- **One measure.** 1200px, twelve columns, wide gutters, no forced offsets. Asymmetry only where content asks for it.
- **Space is the product.** `--section` runs `clamp(5rem, 11vw, 9rem)` and every section uses it, so the page has one cadence.
- **Photography does the work.** Full-bleed monochrome architecture, printed large and lit to be read, not dimmed to a texture.
- **Type is quiet.** The whole scale came down roughly 30% with materially more leading.
- **Oxide is a scalpel.** A rule, an arrow, a button. Never a field, never a pattern.

**The brick pattern is retired.** Not "used sparingly", removed. `BondPattern` is deleted and must not come back.

The brand geometry now lives where it is felt rather than diagrammed: the isometric hover extrusion, and the course rule that lays in from the left on scroll.

## 1a. What was removed, and why it must stay removed

| Removed | Why |
|---|---|
| `BondPattern` | Decoration standing in for substance. Read as filler on every surface it touched |
| The bond offset grid | Did not read as a system, read as inconsistent margins, and left voids |
| `ActionBar` (sticky mobile bar) | Ate a permanent strip of a small screen for an action already in the header |
| `WallProgress` | A brick-masked progress bar is the same pattern by another name |
| Section datum numbers (`01 /`) | Across a dozen sections a device stops reading as a system |
| The home page calculator | Belongs on `/quote`, where someone has already decided to buy |
| **Short decorative dashes** | The little oxide rule beside labels and links. Eight of them. An affordance is an arrow that moves; anything else is filler |

The three unused keyframes and utilities that went with `BondPattern` and
`WallProgress` are deleted too. If a utility is not used, it is not a utility.

## 1b. Measure

Every block of prose carries a **character measure**, not a pixel one: `max-w-[68ch]` on body, `62ch` on lead, `72ch` on small print, and a tighter `14ch` to `22ch` on display type.

Two failures made this a rule rather than a preference. Body copy on `/plant` and `/quality` was running 75 to 85 characters a line at `max-w-2xl`, which at 1.72 leading loses the line return. And `max-w-[20ch]` on the page heading computed *wider* than the column that held it, so it never bound at all and headings ragged badly at 1440.

**Check that a `ch` measure actually binds.** If it computes wider than its column it is decoration.

`text-wrap: pretty` on prose and `balance` on headings handles widows and one-word last lines systemically, in the base layer, rather than by hand-tuning copy.

## 2. Colour

Five brand colours, closed palette. Anything else is a `color-mix` of these, never a new hex.

| Token | Hex | Name |
|---|---|---|
| `--graphite` | `#1A1A1A` | Graphite |
| `--oxide` | `#D35A2A` | Fired Oxide |
| `--umber` | `#4A2F24` | Kiln Umber |
| `--limestone` | `#F2EFEA` | Limestone |
| `--cement` | `#8E8E8E` | Cement Grey |

### Measured contrast, and the rules that follow

Every ratio below is computed, not estimated. `node scripts/contrast-check.mjs` re-runs them.

| Pair | Ratio | Rule |
|---|---|---|
| Graphite on Limestone | 15.18:1 | `--ink` on light |
| Graphite 68% over Limestone | 5.64:1 | `--ink-secondary` on light |
| Umber on Limestone | 10.63:1 | `--ink-accent`, the small accent on light |
| Limestone on Graphite | 15.18:1 | `--ink` on dark |
| Cement on Graphite | 5.31:1 | `--ink-secondary` on dark |
| Oxide 88% + Limestone, on Graphite | 5.06:1 | `--ink-accent` on dark |
| **Limestone on Oxide-deep** | **4.71:1** | Buttons and any fill carrying small text |
| Oxide on Limestone | 3.48:1 | Rules, bars, marks. **Never text under 24px** |
| Oxide on Graphite | 4.36:1 | Same rule |
| Cement on Limestone | 2.86:1 | **Never a text colour on light.** Hairlines only |

Exactly three text colours per ground, all AA at any size. **There is no tertiary ink token**, because a 3.3:1 grey invites misuse.

### Why there is no oxide ground

No text colour clears AA on a pure Fired Oxide field: Limestone reaches 3.48:1 and Graphite only 4.36:1, both short of the 4.5 body-copy floor. So `[data-ground="oxide"]` does not exist. A ground that cannot legally carry a paragraph is a trap, not a token.

Sections that need to shout invert to Graphite and carry Oxide as a full-strength bond band instead. That is Oxide doing its actual job in the system.

### `--oxide-deep`, and when to use it

`color-mix(in srgb, var(--oxide) 80%, var(--graphite))`, resolving to `#AE4D27`. Limestone on it is **4.71:1**.

Use it for **any fill sitting behind text under 24px**: buttons, checked chips, the oxide module face. Buttons carry 12px extrabold type, which needs the full 4.5:1.

Use plain `--oxide` for everything non-text or large: pattern bars, hairlines, the mark's lit faces, the scroll progress strip, the focus ring, display type. There the 3:1 non-text floor applies and pure oxide clears it on both grounds.

Limestone is the default ground. `[data-ground="graphite"]` on any subtree inverts it, the way a real facebrick wall carries darker header courses.

Oxide is **structural**: mark faces, pattern bars, fills, rules, progress. Never a tint, never a wash, never body text.

## 3. Type

Montserrat, two weights only: 400 and 800. `--font-weight-*` is wiped, so a stray `font-semibold` emits nothing and fails loudly rather than synthesising.

| Style | Size | Line | Tracking |
|---|---|---|---|
| Mega | `clamp(2.125rem, 4.4vw, 3.75rem)` | 1.04 | -0.028em |
| Display | `clamp(1.625rem, 2.9vw, 2.375rem)` | 1.12 | -0.022em |
| H1 | `clamp(1.5rem, 2.4vw, 2rem)` | 1.16 | -0.02em |
| H2 | `clamp(1.1875rem, 1.6vw, 1.4375rem)` | 1.24 | -0.014em |
| H3 | 1.0625rem | 1.38 | -0.008em |
| Lead | `clamp(1.0625rem, 1.15vw, 1.1875rem)` | 1.62 | 0 |
| Body | 1rem | 1.72 | 0 |
| Small | 0.875rem | 1.62 | 0 |
| Datum | 0.6875rem | 1 | **+0.16em** |
| Label | 0.8125rem | 1.2 | +0.1em |
| Figure | `clamp(1.375rem, 2.1vw, 1.75rem)` | 1.1 | -0.02em |

**Datum versus label.** Datum is for eyebrows you glance at. `--text-label` is one step up and exists only for form labels and chips: 11px uppercase is fine to skim and too small to read and act on, on a phone, outdoors, in Limpopo sun. Buttons stay at datum, because their meaning is carried by size and fill as well as words.

**Uppercase is for phrases, not prose.** Anything with a subordinate clause goes sentence case. Four mission statements set at 60 characters of uppercase extrabold were the hardest reading on the site.

The ceiling is 3.75rem. If a headline needs to be bigger to have impact, the problem is the space around it, not the point size.

Constrain display lines with a character measure, not a pixel width: `max-w-[20ch]` on a heading keeps the rag right at any viewport.

Display styles render uppercase via CSS. The markup stays sentence case so screen readers and search engines read natural case.

The technical register comes from **tabular numerals, uppercase micro-caps at +0.18em, hairline rules and real SANS specs**. Not from adding a second typeface. Every figure on the site is `font-variant-numeric: tabular-nums`.

## 4. Radius: zero

`--radius-*` is wiped. Only `--radius-none` exists.

1. There is not one curve in the mark. Five polygons, mitred vertices.
2. A cast concrete unit has a sharp arris. A rounded arris is a defect, and chipped stock is rejected stock. Rounding lies about the product.
3. The hard 30 degree face only reads as a face if the corners are square. Any radius turns the extrusion into a halo.

## 5. The isometric constant

`--iso-tan: 0.5774`, `--iso-x: 12px`, `--iso-y: 6.93px`, mirrored by `ISO_ANGLE` in `src/lib/iso.ts`.

Every 30 degree move on the site reads from those two places and nowhere else: the monogram geometry, the hover extrusion, the module entrance vector and the bond parallax. Changing the angle is a two-line edit.

## 6. Motion

House tiers: **120ms** hovers and toggles, **200ms** reveals, **300ms** sheets. One exception, `--dur-set` at 520ms, the entrance of a brick being laid. Ease-out on entry, ease-in on exit. No bounce, no spring, nothing decorative.

| Animation | Where | Mechanism |
|---|---|---|
| `course-lay` | Every section rule and seam. `scaleX(0)` to `scaleX(1)`, origin left | `view()`, entry 8% to 46% |
| `course-set` | Modules arriving along the isometric axis | `view()`, entry 6% to 44% |
| `course-set` (load) | Hero copy, staggered 70/100/140/180/260/340ms | document timeline |
| `brick-set` | The monogram's two courses, delays 0 and 120ms, so the mark builds bottom-up | document timeline |
| `wall-fill` | Scroll progress, masked into discrete 40px bricks with 3px joints | `scroll(root block)` |
| `bond-drift` | Two counter-drifting pattern layers, moving on the isometric axis | `view()`, cover 0% to 100% |

The signature is **`course-lay`**: a hairline laid in from the left, the way a bricklayer runs a string line before setting a course. Left to right, in the reading direction, once per section.

The dominant reveal is horizontal. If you pause mid-scroll, the motion is sideways, not upward. That alone separates it from every fade-up template.

### Degradation is structural, not tested

**The authored CSS is always the finished state. Every animation lives inside `@supports (animation-timeline: view())`.** There is no `opacity: 0` sitting outside a support query anywhere in the project, and that is greppable.

`animation-timeline` ships in Chrome, Edge and Safari 26, but not Firefox as of mid 2026. Firefox and Safari 18 users get every section fully visible, every hairline at full width, nothing displaced or clipped, no progress strip, no parallax. They keep the load-time hero stagger, the monogram set, every hover extrusion and every transition, because those are ordinary CSS.

### Reduced motion has a trap

A scroll-driven animation **ignores `animation-duration`**, so the usual `0.01ms !important` kill switch does not stop it. The media query must also set `animation-timeline: auto !important`, which sends the animation to its resting state on the document timeline. Animations whose `to` state is a displacement (`bond-drift`) must be killed outright rather than snapped to, and the progress strip is hidden.

## 7. Components

**Modules.** Square, opaque, 1px hairline. At rest a module is flat. On hover or `:focus-visible` it gains a hard graphite side face: `box-shadow: var(--iso-x) var(--iso-y) 0 0`, no blur, at the logo's own projection angle, while translating half a step up-left so the volume grows about its centre instead of sliding.

**Never**: `backdrop-filter`, `border-radius`, blurred shadows, gradient fills. Exactly one `linear-gradient` exists sitewide, the photo scrim.

**Glyphs are hand-authored** on the same orthogonal grid, 2px flat-capped strokes, `currentColor`. No icon library. Lucide's rounded caps fight a brand with no curve in it, and a generic icon set is one of the loudest templated-site tells.

**Focus**: 3px oxide ring, offset 2px, visible always, keyboard included. It clears 3:1 on both grounds.

## 8. Voice

Plain, active, specific. Sentence case everywhere except the wordmark. **No em dashes.** Buttons say what happens: Get a quote, Calculate quantity, Book a plant visit. Never Submit.

Money `R12 500.00`, space thousands separator, point decimal. Dates `24 May 2026`. Times 24-hour. Dimensions `222 x 106 x 73 mm`, spaced, lowercase mm.

The company is new and the copy says so. No claimed projects, no invented client logos, no "20+ years combined experience", no fabricated tonnage counters, no review widget with no reviews.

## 9. Accessibility

AA minimum, and the colour table above is how it is guaranteed rather than hoped for. Focus visible on every interactive element. Hit targets 44px minimum on touch. Reduced motion respected globally. Every page must read completely with JavaScript disabled.
