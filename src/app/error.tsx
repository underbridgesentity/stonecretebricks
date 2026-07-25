"use client";

import { useEffect } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { Course, Stretcher, Wall } from "@/components/ui/wall";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="py-[var(--section)]">
      <Wall>
        <Course>
          <Stretcher span="measure">
            <p className="mb-7 text-datum uppercase text-ink-secondary">
              Something broke
            </p>
            <h1 className="text-display uppercase text-ink">That did not load.</h1>
            <p className="mt-6 max-w-xl text-lead text-ink-secondary">
              Try again. If it keeps happening, WhatsApp us and we will take the enquiry that way
              instead, so nothing waits on the website.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button variant="oxide" onClick={reset}>
                Try again
              </Button>
              <ButtonLink href="/" variant="outline">
                Back to the home page
              </ButtonLink>
            </div>
          </Stretcher>
        </Course>
      </Wall>
    </section>
  );
}
