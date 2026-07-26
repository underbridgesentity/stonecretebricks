"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Close, Courses, Phone, Whatsapp } from "@/components/ui/glyph";
import { COMPANY, LEGAL_NAV, NAV, telLink, whatsappLink } from "@/data/company";

/**
 * The only interactive component in the site chrome. Full-bleed graphite
 * panel, courses staggering in, focus trapped, Escape to close, focus returned
 * to the trigger.
 *
 * The trigger renders server-side, so nothing shifts when hydration lands.
 *
 * The panel is PORTALLED TO BODY, and that is not cosmetic. This component
 * lives inside <header>, and the open effect marks header, main and footer
 * `inert` so a screen reader cannot walk out of the dialog into the page
 * behind it. `inert` applies to the whole subtree, and a div[role=dialog] does
 * not escape it the way a real <dialog> opened with showModal() would. Left as
 * a child of the header, the panel inerted itself the instant it opened: every
 * link dead, the close button dead, and on a phone there is no Escape key.
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

    const behind = ["header", "main", "footer"]
      .map((sel) => document.querySelector(sel))
      .filter((el): el is HTMLElement => el instanceof HTMLElement);
    for (const el of behind) el.setAttribute("inert", "");

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
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

    // Captured now: the ref may have moved by the time cleanup runs.
    const opener = trigger.current;

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
      for (const el of behind) el.removeAttribute("inert");
      /*
       * Restore focus here, not in the close handlers. Calling focus() beside
       * setOpen() runs while the header is still inert, so it silently does
       * nothing and focus falls to body.
       */
      opener?.focus();
    };
  }, [open]);

  const sheet = (
    <div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      data-ground="graphite"
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ground lg:hidden"
    >
      <div className="sticky top-0 z-10 flex h-[var(--header-h)] shrink-0 items-center justify-end bg-ground px-6">
        <button
          type="button"
          onClick={() => setOpen(false)}
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

        {tel ? <p className="mt-4 text-small text-ink-secondary">{COMPANY.phone.value}</p> : null}

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
  );

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

      {/* `open` only ever becomes true from a click, which is client-side, so
          document is guaranteed to exist by the time this renders. */}
      {open ? createPortal(sheet, document.body) : null}
    </>
  );
}
