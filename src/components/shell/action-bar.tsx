import Link from "next/link";

import { Arrow, Phone, Whatsapp } from "@/components/ui/glyph";
import { telLink, whatsappLink } from "@/data/company";

/**
 * The hot lane, pinned to the bottom on mobile.
 *
 * South African construction trade runs on WhatsApp, so it sits first and the
 * message is pre-filled with the questions we need answered. Pre-filling the
 * questions rather than a greeting trains customers to send a qualified
 * enquiry, which is worth more than a slightly higher contact rate.
 */
export function ActionBar() {
  const tel = telLink();
  const wa = whatsappLink(
    "Hi Stonecrete Bricks, I need a price on bricks.\n\nProduct: \nQuantity: \nSite address: \nDate needed: ",
  );

  const cell = "inline-flex flex-1 items-center justify-center gap-2 py-4 text-datum-strong uppercase";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line-strong bg-ground lg:hidden">
      {wa ? (
        <a href={wa} className={`${cell} bg-graphite text-limestone`}>
          <Whatsapp width={18} height={18} />
          WhatsApp
        </a>
      ) : null}

      {tel ? (
        <a href={tel} className={`${cell} border-l border-line text-ink`}>
          <Phone width={18} height={18} />
          Call
        </a>
      ) : null}

      <Link href="/quote" className={`${cell} bg-oxide-deep text-limestone`}>
        Get a quote
        <Arrow width={18} height={18} />
      </Link>
    </div>
  );
}
