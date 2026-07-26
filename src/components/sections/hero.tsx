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
      {/*
        The photograph shows the product, which it did not before.

        hero.jpg is a beautiful frame and it is the wrong one: monumental
        cast in-situ civic concrete, a coffered precast panel, and a wall of
        random coursed natural stone bottom right. Stonecrete Bricks makes
        stock bricks, maxi bricks, hollow blocks and pavers, and not one of
        them is in that picture. Worse, the 105deg scrim is most transparent
        at the bottom right, so the clearest thing on the home page was the
        one material the company does not sell.

        blockwork.jpg is a house in concrete masonry block: countable courses,
        visible module, running bond, a boundary wall behind it in the same
        unit, in light that reads as this country. It was at half column width
        in section four. The best asset on the site was the small one.

        It also simply fits better. At 3000x1500 it crops nothing horizontally
        at 1440 and about 2% vertically, where hero.jpg at 2400 wide was being
        upscaled 1.2x on any Retina desktop. The object-position was doing
        nothing either: at 1440x756 the container is 1.905:1 against a 1.778:1
        source, so cover scales to width and there is no horizontal overflow
        for 62% to move. It only ever engaged in portrait. It is stated once
        now, and stated for the crop that actually happens.
      */}
      <Image
        src="/images/site/blockwork.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[58%_center]"
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
          {/* The city, not the province. Polokwane appeared in all four product
              SEO descriptions and in the layout metadata, with a comment there
              saying the city should lead, and then never once in copy a buyer
              can read. A buyer in Seshego wants Polokwane. So does Google. */}
          Manufactured in {COMPANY.suburb.value}, {COMPANY.region.value}
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
          {/* "Cast" was wrong and our own plant page said so: these are
              vibrated and pressed in steel moulds, and a brickmaker reads cast
              as wet cast. "The South African standard", singular, was wrong
              too, on a site that spends a whole page insisting there are two
              of them and that the difference matters. */}
          Stock bricks, maxi bricks, hollow blocks and pavers, pressed and cured to SANS 1215 and
          SANS 1058, delivered across {COMPANY.region.value}.
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
