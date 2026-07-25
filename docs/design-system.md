# Stonecrete Bricks design system v0.1

This file outranks any summary of it. Tokens live in `src/app/globals.css`.

## 1. The spine: the page is a running-bond wall

The logo is two brick volumes in isometric projection, offset like a stepped bond. The site's layout grid **is** that bond, not a metaphor printed on a normal grid.

12 columns, wall width 1344px, column 112px.

- A **stretcher** spans 6 columns. A **queen closer** spans 3.
- **Odd course**: two stretchers, one seam at column 7.
- **Even course**: closer, stretcher, closer. Seams at columns 4 and 10.

Stacked, the seams alternate 7 / 4-10 / 7 down the page. Nothing lines up vertically, by construction. That single fact is the whole look.

Below `md` the bond collapses to a **soldier course**: one column, full-width modules, hairline seams, no closers. Running bond needs width. Forcing it at 375px would be theatre.

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
| Mega | `clamp(3.25rem, 12vw, 9.5rem)` | 0.84 | -0.045em |
| Display | `clamp(2.5rem, 7vw, 5.5rem)` | 0.90 | -0.035em |
| H1 | `clamp(2rem, 4.5vw, 3.25rem)` | 0.98 | -0.03em |
| H2 | `clamp(1.5rem, 2.6vw, 2rem)` | 1.06 | -0.02em |
| H3 | 1.125rem | 1.3 | -0.01em |
| Lead | `clamp(1.125rem, 1.6vw, 1.375rem)` | 1.5 | 0 |
| Body | 1.0625rem | 1.6 | 0 |
| Small | 0.875rem | 1.45 | 0 |
| Datum | 0.75rem | 1 | **+0.18em** |
| Figure | `clamp(1.75rem, 3.2vw, 2.75rem)` | 1 | -0.02em |

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
