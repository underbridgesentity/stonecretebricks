"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Close, Courses } from "@/components/ui/glyph";
import { NAV } from "@/data/company";

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

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !panel.current) return;

      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

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
        className="inline-flex size-12 items-center justify-center text-ink lg:hidden"
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
          className="fixed inset-0 z-50 flex flex-col bg-ground lg:hidden"
        >
          <div className="flex h-[var(--header-h)] items-center justify-end px-6">
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
          <nav className="flex flex-1 flex-col justify-center gap-1 px-6 pb-24">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="animate-set border-b border-line py-5 text-h1 uppercase text-ink"
                style={{ animationDelay: `${70 + i * 40}ms` }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="animate-set mt-8 inline-flex h-14 items-center justify-center bg-oxide-deep px-6 text-datum-strong uppercase text-limestone"
              style={{ animationDelay: `${70 + NAV.length * 40}ms` }}
            >
              Get a quote
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}
