"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Close, Courses, Phone, Whatsapp } from "@/components/ui/glyph";
import { COMPANY, LEGAL_NAV, NAV, telLink, whatsappLink } from "@/data/company";

/**
 * The only interactive component in the site chrome. Full-bleed graphite
 * panel, courses staggering in, focus trapped, Escape to close, focus returned
 * to the trigger.
 *
 * The trigger renders server-side, so nothing shifts when hydration lands.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const tel = telLink();
  const wa = whatsappLink("Hi Stonecrete Bricks, I need a price on bricks.");

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    /*
     * `aria-modal` alone leaves everything behind the sheet in the tab order
     * and in the accessibility tree, so a screen reader user could walk
     * straight out of the dialog into the page underneath it. `inert` removes
     * both in one attribute.
     */
    const behind = ["main", "header", "footer"]
      .map((sel) => document.querySelector(sel))
      .filter((el): el is HTMLElement => el instanceof HTMLElement);
    for (const el of behind) el.setAttribute("inert", "");

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !panel.current) return;

      const focusable = panel.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      /*
       * Containment, not identity. Comparing against the first and last
       * elements missed the case where focus had landed on the panel chrome
       * or on body, at which point the trap could not fire at all.
       */
      if (!panel.current.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    panel.current?.querySelector<HTMLElement>("a[href], button")?.focus();

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
      for (const el of behind) el.removeAttribute("inert");
    };
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex size-12 items-center justify-center text-limestone lg:hidden"
      >
        <Courses width={24} height={24} />
        <span className="sr-only">Open menu</span>
      </button>

      {open ? (
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-ground="graphite"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ground lg:hidden"
        >
          <div className="flex h-[var(--header-h)] shrink-0 items-center justify-end px-6">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                trigger.current?.focus();
              }}
              className="inline-flex size-12 items-center justify-center text-ink"
            >
              <Close width={24} height={24} />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          {/* Closing on click rather than watching the pathname: setState in an
              effect causes a cascading render, and the click is the real event. */}
          <nav aria-label="Main" className="flex flex-col gap-1 px-6 pb-10">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="animate-set border-b border-line py-4 text-h1 uppercase text-ink"
                style={{ animationDelay: `${70 + i * 35}ms` }}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="animate-set mt-6 inline-flex h-14 items-center justify-center bg-oxide-deep px-6 text-label uppercase text-limestone"
              style={{ animationDelay: `${70 + NAV.length * 35}ms` }}
            >
              Request a quote
            </Link>

            {/* The two channels this trade actually uses. Without these the
                nearest tel: or wa.me link was eight screens down in the footer. */}
            <div className="mt-6 grid grid-cols-2 gap-[var(--joint)]">
              {wa ? (
                <a
                  href={wa}
                  className="inline-flex h-14 items-center justify-center gap-2 border border-line-strong text-label uppercase text-ink"
                >
                  <Whatsapp width={18} height={18} className="text-oxide" />
                  WhatsApp
                </a>
              ) : null}
              {tel ? (
                <a
                  href={tel}
                  className="inline-flex h-14 items-center justify-center gap-2 border border-line-strong text-label uppercase text-ink"
                >
                  <Phone width={18} height={18} className="text-oxide" />
                  Call
                </a>
              ) : null}
            </div>

            {tel ? (
              <p className="mt-4 text-small text-ink-secondary">{COMPANY.phone.value}</p>
            ) : null}

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6">
              {LEGAL_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-small text-ink-secondary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
