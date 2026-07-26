import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Arrow } from "@/components/ui/glyph";
import { Wall } from "@/components/ui/wall";
import { COMPANY } from "@/data/company";

/**
 * Full-bleed monochrome architecture under a heavy scrim.
 *
 * The first cut was a light hero carrying a 100px headline and a spec table.
 * It read as loud rather than considered. This one does the opposite: one
 * photograph, one sentence, one action, and a great deal of quiet.
 *
 * Content sits low and left rather than centred, which is how an editorial
 * cover is set. The photograph is the premium; the type stays out of its way.
 */
export function Hero() {
  return (
    <section
      data-ground="graphite"
      className="relative flex min-h-[84svh] items-end overflow-hidden bg-graphite"
    >
      <Image
        src="/images/site/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_center]"
      />

      {/*
        Two problems, one fix.
        Gradient stops are box-relative, and this box is portrait on a phone and
        landscape on a desktop. A single 105deg scrim spans 560px of gradient
        line at 390x709, where one paragraph of copy crosses 59% of it, against
        1587px at 1440x756 where the same copy crosses 24%. So a diagonal tuned
        for desktop put 7% of the mobile lead below 4.5:1.
        And rgb() with alpha rather than color-mix: Tailwind guards color-mix
        behind @supports and its fallback substituted opaque graphite for every
        transparent stop, painting the first 72% of the hero solid black on
        Safari below 16.4.
        Phones get a bottom-weighted vertical scrim, which cannot collapse
        because the copy sits at the bottom whatever the box shape. The diagonal
        returns from md, where the box is landscape and it reads.
      */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(26,26,26,1)_0%,rgba(26,26,26,0.92)_38%,rgba(26,26,26,0.55)_70%,rgba(26,26,26,0.25)_100%)] md:bg-[linear-gradient(105deg,rgba(26,26,26,1)_0%,rgba(26,26,26,0.82)_38%,rgba(26,26,26,0.35)_72%,rgba(26,26,26,0)_100%)]"
      />

      <Wall className="relative pb-16 pt-20 sm:pt-28 md:pb-24 md:pt-40">
        <p
          className="animate-set text-datum uppercase text-limestone"
          style={{ animationDelay: "80ms" }}
        >
          Manufactured in {COMPANY.region.value}
        </p>

        <h1
          className="animate-set mt-8 max-w-[16ch] text-mega uppercase text-limestone"
          style={{ animationDelay: "160ms" }}
        >
          Strength in every brick
        </h1>

        <p
          className="animate-set mt-7 max-w-[38ch] text-lead text-limestone"
          style={{ animationDelay: "260ms" }}
        >
          Stock bricks, maxi bricks, hollow blocks and pavers, cast and cured to the South African
          standard and delivered to site.
        </p>

        <div
          className="animate-set mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          style={{ animationDelay: "340ms" }}
        >
          <ButtonLink href="/quote" variant="oxide">
            Request a quote
            <Arrow width={16} height={16} />
          </ButtonLink>

          <Link
            href="/products"
            className="group inline-flex items-center gap-2.5 text-datum-strong uppercase text-limestone"
          >
            See the range
            <Arrow
              width={16}
              height={16}
              className="transition-transform duration-[var(--dur-reveal)] group-hover:translate-x-1"
            />
          </Link>
        </div>
      </Wall>
    </section>
  );
}
