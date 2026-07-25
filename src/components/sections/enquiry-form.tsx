"use client";

import { useActionState, useEffect, useRef } from "react";

import { submitEnquiry, type EnquiryState } from "@/app/actions/enquiry";
import { Button } from "@/components/ui/button";
import { Chip, Field, Select, TextArea, TextInput } from "@/components/ui/field";
import { Arrow } from "@/components/ui/glyph";
import { PRODUCTS } from "@/data/products";

/**
 * The quote form, ordered on a commitment gradient: what you need before who
 * you are. Personal details come last, once the person has already invested
 * effort, which lifts completion.
 *
 * Only mobile is genuinely required. Email and company are optional because a
 * contractor on a site does not always have either to hand.
 *
 * It is a plain form posting to a server action, so it works with JavaScript
 * disabled. useActionState only adds inline error display on top.
 */
export function EnquiryForm({
  defaultProduct,
  defaultQuantity,
}: {
  defaultProduct?: string;
  defaultQuantity?: string;
}) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, {});
  const errors = state.errors ?? {};
  const startedAt = useRef<HTMLInputElement>(null);

  // Stamped after mount, never during render: Date.now() in the render body is
  // impure and would mismatch between the server and client HTML. With
  // JavaScript off the field stays empty and the action skips the timing check.
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);

  return (
    <form action={action} className="flex flex-col gap-10">
      {/* Honeypot plus a timing floor. No captcha: this audience is often on a
          poor mobile connection and a challenge would cost more than it saves. */}
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this blank</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {errors.form ? (
        <p role="alert" className="border border-oxide bg-ground-2 p-4 text-body text-ink">
          {errors.form}
        </p>
      ) : null}

      <Step number="01" title="What do you need?">
        <fieldset>
          <legend className="sr-only">Products</legend>
          <div className="flex flex-wrap gap-[var(--joint)]">
            {PRODUCTS.map((p) => (
              <Chip
                key={p.slug}
                name="products"
                value={p.slug}
                label={p.name}
                defaultChecked={defaultProduct === p.slug}
              />
            ))}
            <Chip
              name="products"
              value="custom"
              label="Custom units"
              defaultChecked={defaultProduct === "custom"}
            />
          </div>
          {errors.products ? (
            <p role="alert" className="mt-3 text-small text-ink-accent">
              {errors.products}
            </p>
          ) : null}
        </fieldset>
      </Step>

      <Step number="02" title="How much?">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Quantity" htmlFor="quantity" hint="Leave blank if you are not sure yet">
            <TextInput
              id="quantity"
              name="quantity"
              inputMode="numeric"
              defaultValue={defaultQuantity ?? state.values?.quantity}
              placeholder="5000"
            />
          </Field>
          <Field label="Measured in" htmlFor="quantityUnit">
            <Select id="quantityUnit" name="quantityUnit" defaultValue="units">
              <option value="units">Units</option>
              <option value="square-metres">Square metres</option>
              <option value="pallets">Pallets</option>
            </Select>
          </Field>
        </div>
      </Step>

      <Step number="03" title="Where is it going?">
        <Field
          label="Delivery suburb or town"
          htmlFor="suburb"
          required
          hint="Delivery is the biggest variable in the price, so we ask early"
          error={errors.suburb}
        >
          <TextInput
            id="suburb"
            name="suburb"
            required
            autoComplete="address-level2"
            defaultValue={state.values?.suburb}
          />
        </Field>
      </Step>

      <Step number="04" title="When do you need it?">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Date needed" htmlFor="needed" hint="Or leave blank if it is flexible">
            <TextInput id="needed" name="needed" type="date" defaultValue={state.values?.needed} />
          </Field>
          <Field label="What are you building?" htmlFor="projectType">
            <Select id="projectType" name="projectType" defaultValue="">
              <option value="">Select if it helps</option>
              <option value="house">House or extension</option>
              <option value="boundary-wall">Boundary wall</option>
              <option value="housing-development">Housing development</option>
              <option value="commercial">Commercial building</option>
              <option value="industrial">Industrial building</option>
              <option value="government">Government or municipal</option>
              <option value="paving">Driveway or paving</option>
              <option value="resale">Reselling as a hardware store</option>
            </Select>
          </Field>
        </div>
      </Step>

      <Step number="05" title="Who are you?">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name" htmlFor="name" required error={errors.name}>
            <TextInput
              id="name"
              name="name"
              required
              autoComplete="name"
              defaultValue={state.values?.name}
            />
          </Field>
          <Field label="Mobile" htmlFor="mobile" required error={errors.mobile}>
            <TextInput
              id="mobile"
              name="mobile"
              type="tel"
              required
              autoComplete="tel"
              defaultValue={state.values?.mobile}
            />
          </Field>
          <Field label="Company" htmlFor="company" hint="Optional">
            <TextInput
              id="company"
              name="company"
              autoComplete="organization"
              defaultValue={state.values?.company}
            />
          </Field>
          <Field label="Email" htmlFor="email" hint="Optional" error={errors.email}>
            <TextInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={state.values?.email}
            />
          </Field>
        </div>

        <Field label="How should we reach you?" htmlFor="contactPreference" className="mt-4">
          <Select id="contactPreference" name="contactPreference" defaultValue="whatsapp">
            <option value="whatsapp">WhatsApp</option>
            <option value="call">Phone call</option>
            <option value="email">Email</option>
          </Select>
        </Field>
      </Step>

      <Step number="06" title="Anything else?">
        <Field label="Notes" htmlFor="notes" hint="Access, offloading, programme dates, anything unusual">
          <TextArea id="notes" name="notes" defaultValue={state.values?.notes} />
        </Field>
      </Step>

      <div className="flex flex-col gap-6 border-t border-line-strong pt-8">
        <div className="flex gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            className="mt-1 size-5 shrink-0 accent-[var(--oxide)]"
          />
          <label htmlFor="consent" className="text-small text-ink-secondary">
            I agree that Stonecrete Bricks may contact me about this enquiry and store my details as
            set out in the privacy notice.
          </label>
        </div>
        {errors.consent ? (
          <p role="alert" className="text-small text-ink-accent">
            {errors.consent}
          </p>
        ) : null}

        <Button type="submit" variant="oxide" disabled={pending} className="self-start">
          {pending ? "Sending" : "Send quote request"}
          <Arrow width={16} height={16} />
        </Button>
      </div>
    </form>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 border-t border-line pt-8">
      <h2 className="flex items-baseline gap-4">
        <span className="text-datum uppercase text-ink-secondary">{number}</span>
        <span className="text-h2 uppercase text-ink">{title}</span>
      </h2>
      {children}
    </section>
  );
}
