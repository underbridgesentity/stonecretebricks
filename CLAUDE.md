# Stonecrete Bricks

The marketing website for Stonecrete Bricks, a South African concrete brick and block manufacturer launching new. Product-led, conversion-focused, built to stand out in an industry whose competitors mostly ship poor sites.

## Source of truth

- docs/design-system.md: tokens, the bond grid, motion, colour rules. Outranks any summary of it
- docs/brand.md: the mark, its construction, and the one face that is deliberately missing
- src/data/products.ts and src/data/company.ts: every fact about the business. Nothing is hardcoded elsewhere

## Stack

Next.js App Router on Vercel. Tailwind v4, CSS-first, no config file. Resend for quote enquiries. Everything is a server component except the mobile nav, the calculator and the quote form.

No animation library. Motion is CSS keyframes plus scroll-driven animations. No icon library. No cn(), clsx, cva or shadcn.

## Non-negotiables

- Colour routes through tokens, never hardcoded hex
- Every animation lives inside `@supports (animation-timeline: view())`. The authored CSS is always the finished state, so a browser without scroll timelines renders a complete page
- Every product number carries a `confirmed` or `assumed` flag. Assumed values are South African industry standards, not invented, and the client signs them off before launch
- SANS 1215 governs masonry units. SANS 1058 governs pavers, on tensile splitting and abrasion, never compressive MPa
- **Verify every standards claim before publishing it.** SANS 10400-K deemed-to-satisfy is 3.0 MPa hollow and 4.0 MPa solid for single storey, 7.0 and 10 for the lower storey of a double. An earlier build published the wrong pair, which on a site selling on published specifications is the worst available error
- Numbers in prose must agree with `src/data/products.ts`. Prefer deriving them. Two copy lines contradicted the table on their own page
- No claimed projects, clients, testimonials or years in business. The company is new and the site says so
- `sizes` is required on every Photo
- Every prose block carries a character measure, and it must actually bind. Check it computes narrower than its column

## Conventions

- The name is Stonecrete Bricks, exact case, everywhere. Never bare "Stonecrete", which belongs to a different company in Johannesburg
- No em dashes in any document, comment, interface text or generated content. Use commas, colons, periods
- Sentence case everywhere except the wordmark
- Money: R12 500.00, space thousands separator, point decimal. Dates: 24 May 2026. Times: 24-hour
- Buttons say what happens: Get a quote, Calculate quantity, never Submit
- Files kebab-case. Components PascalCase named exports, never default
- Class composition is a template literal with `className = ""` appended last. Variants are a `Record<Variant, string>`

## Commands

- pnpm dev: local server (autoPort, .claude/launch.json)
- pnpm typecheck, pnpm lint
- pnpm brand:icons: rebuild favicon.ico and apple-icon.png from the SVG master
- pnpm specs:audit: list every product spec still flagged assumed

Local env lives in .env.local (see .env.example). Without RESEND_API_KEY, quote enquiries print to the dev terminal.
