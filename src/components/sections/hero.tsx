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

      {/* One scrim, not two. Stacked, they multiplied to roughly 95% graphite
          in the bottom left, exactly where the type sits, which dimmed the
          photograph to a texture. A single diagonal holds the copy and lets
          more of the building read. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(105deg,var(--graphite)_0%,color-mix(in_srgb,var(--graphite)_78%,transparent)_38%,color-mix(in_srgb,var(--graphite)_30%,transparent)_72%,transparent_100%)]"
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
