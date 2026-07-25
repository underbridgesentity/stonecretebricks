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
      className="relative flex min-h-[84vh] items-end overflow-hidden bg-graphite"
    >
      <Image
        src="/images/site/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_center]"
      />

      {/* Two scrims, weighted left and low so the copy holds contrast while the
          architecture stays legible. The photograph is the premium here, so it
          is lit to be read rather than dimmed to a texture. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/45 to-graphite/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-graphite/90 via-graphite/45 to-transparent"
      />

      <Wall className="relative pb-16 pt-32 md:pb-24 md:pt-40">
        <p
          className="animate-set text-datum uppercase text-limestone/70"
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
          className="animate-set mt-7 max-w-lg text-lead text-limestone/75"
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
            className="group inline-flex items-center gap-2.5 text-datum-strong uppercase text-limestone transition-colors hover:text-oxide-lift"
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
