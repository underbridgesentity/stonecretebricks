import Link from "next/link";

import { Lockup } from "@/components/brand/wordmark";
import { ButtonLink } from "@/components/ui/button";
import { WallProgress } from "@/components/ui/wall-progress";
import { NAV } from "@/data/company";

import { MobileNav } from "./mobile-nav";

/**
 * Course zero. Flush-left lockup, right-aligned nav, sitting on the first
 * course line of the wall.
 *
 * No blur, no floating pill, no backdrop filter. Its bottom hairline is a real
 * structural edge, not a decoration.
 */
export function SiteHeader() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-ground">
        <div className="mx-auto flex h-[var(--header-h)] w-full max-w-[var(--wall)] items-center justify-between gap-6 px-6 md:px-8">
          <Link href="/" className="text-[1.25rem] text-ink" aria-label="Stonecrete Bricks, home">
            <Lockup orientation="horizontal" />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-datum-strong uppercase text-ink-secondary transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href="/quote" variant="oxide" className="h-11">
              Get a quote
            </ButtonLink>
          </nav>

          <MobileNav />
        </div>
      </header>
      <WallProgress />
    </>
  );
}
