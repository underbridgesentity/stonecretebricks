# Stonecrete Bricks

Marketing website for Stonecrete Bricks, a South African concrete brick, block and paver manufacturer.

Next.js 16, React 19, Tailwind v4 (CSS-first, no config file), deployed to Vercel. No animation library, no icon library, no component library: motion is CSS scroll-driven animation and the glyphs are hand-authored.

## Running it

```bash
pnpm install
pnpm dev
```

| Command | What it does |
|---|---|
| `pnpm dev` | Local server |
| `pnpm build` | Production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm specs:audit` | Lists every fact the client still owes us |
| `pnpm brand:icons` | Rebuilds favicon, apple icon and the OG image from the mark |
| `node scripts/contrast-check.mjs` | Re-runs every colour pair against WCAG AA |

Copy `.env.example` to `.env.local`. Without `RESEND_API_KEY` quote enquiries are recorded and printed to the dev terminal, so the whole flow is testable with no credentials.

## Where things live

| Path | What |
|---|---|
| `docs/design-system.md` | Tokens, the bond grid, motion, colour rules. Outranks any summary |
| `docs/brand.md` | The mark, its construction, and the face that is deliberately missing |
| `src/data/company.ts` | Every contact fact, in one place. Nothing is hardcoded elsewhere |
| `src/data/products.ts` | The four products, every figure flagged confirmed or assumed |
| `src/lib/iso.ts` | The 32.36 degree projection the whole brand runs on |
| `src/lib/calculator.ts` | Quantity maths, derived from coordinating size |
| `src/components/ui/wall.tsx` | `Wall`, `Course`, `Stretcher`: the running bond |

## Two things to know before changing anything

**Product figures are not confirmed.** The client supplied no specifications, so every dimension, strength, mass and pallet count is a South African industry standard flagged `assumed`. Run `pnpm specs:audit` for the list. They must be confirmed against the client's own units and test certificates before launch.

**SANS 1215 governs masonry units. SANS 1058 governs pavers**, on tensile splitting strength and abrasion, never compressive MPa. Publishing an MPa figure against a paver is the tell of a site written by someone who has never sold one, so the paver type has no compressive field at all.

## Naming

The name is **Stonecrete Bricks**, both words, everywhere. Never bare "Stonecrete": that is a different cement products manufacturer in Meredale, Johannesburg that also retails bricks. Keeping the full lockup in every title, citation and structured-data record is what separates the two entities in search over time. See `docs/brand.md`.
