import Link from "next/link";

import { Lockup } from "@/components/brand/wordmark";
import { NAV } from "@/data/company";

import { MobileNav } from "./mobile-nav";

/**
 * Graphite site-wide.
 *
 * A light bar above a dark photographic hero cuts a hard band across the top
 * of the page. Carrying the dark through the header instead lets the hero run
 * straight out of it, and it gives every inner page the same anchored top.
 *
 * No blur, no floating pill, no shrink-on-scroll. It is a plate, and it stays
 * a plate.
 */
export function SiteHeader() {
  return (
    <header
      data-ground="graphite"
      className="sticky top-0 z-40 border-b border-limestone/10 bg-graphite"
    >
      <div className="mx-auto flex h-[var(--header-h)] w-full max-w-[var(--wall)] items-center justify-between gap-8 px-6 md:px-10">
        <Link
          href="/"
          className="text-[1.0625rem] text-limestone"
          aria-label="Stonecrete Bricks, home"
        >
          <Lockup orientation="horizontal" variant="on-dark" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-datum uppercase text-limestone/65 transition-colors hover:text-limestone"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/quote"
            className="group inline-flex items-center gap-3 text-datum-strong uppercase text-limestone"
          >
            Get a quote
            <span
              aria-hidden
              className="inline-block h-px w-6 bg-oxide transition-all group-hover:w-10"
            />
          </Link>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
