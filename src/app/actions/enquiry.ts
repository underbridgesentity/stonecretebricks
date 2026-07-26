"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { COMPANY } from "@/data/company";
import { PRODUCTS } from "@/data/products";
import { reference } from "@/lib/response-time";

/**
 * Quote enquiries.
 *
 * Order of operations matters: record the lead first, notify second. An email
 * provider outage must never lose an enquiry, and for a business with no other
 * pipeline a lost enquiry is the most expensive bug on the site.
 *
 * Without RESEND_API_KEY the enquiry prints to the dev terminal, so the whole
 * flow is testable locally with no credentials.
 */

const SLUGS = PRODUCTS.map((p) => p.slug);

const schema = z.object({
  products: z.array(z.string()).min(1, "Choose at least one product"),
  // Zod's own text ("Too big: expected string to have <=60 characters") was
  // reaching the buyer verbatim, and only in the summary at the top, because
  // neither of these two fields passed an error prop to Field.
  quantity: z.string().max(60, "That quantity is too long. Just the number is fine.").optional(),
  quantityUnit: z.enum(["units", "square-metres", "pallets"]).optional(),
  fulfilment: z.enum(["deliver", "collect"]).default("deliver"),
  suburb: z.string().min(2, "Tell us the suburb or town so we can price delivery").max(120),
  needed: z.string().max(60).optional(),
  projectType: z.string().max(80).optional(),
  name: z.string().min(2, "Tell us who you are").max(120),
  /*
   * Mobile is the only required contact channel, email is optional, so this is
   * the single field standing between an enquiry and a lead nobody can reach.
   * It was z.string().min(9).max(30), which accepts "aaaaaaaaaaa": the form
   * would take it, issue a reference, and promise a callback to nothing.
   * Deliberately loose about shape, because South African numbers get written
   * 084 290 4671, 0842904671, +27 84 290 4671 and 27-84-290-4671, and a strict
   * pattern rejects real buyers. It just has to actually be a phone number:
   * at least nine digits, and nothing in it that cannot be part of one.
   */
  mobile: z
    .string()
    .max(30)
    .refine((v) => (v.match(/\d/g) ?? []).length >= 9, "We need a number to reach you on")
    .refine(
      (v) => /^[\d\s()+\-.]+$/.test(v),
      "That does not look like a phone number. Digits, spaces and a plus are fine.",
    ),
  company: z.string().max(120).optional(),
  email: z.string().email("Check the email address").max(160).or(z.literal("")).optional(),
  contactPreference: z.enum(["whatsapp", "call", "email"]).default("whatsapp"),
  notes: z.string().max(2000, "That is longer than we can accept. Trim it and send the rest with the quote.").optional(),
  consent: z.literal("on", { message: "We need your permission to contact you" }),
});

export type EnquiryState = { errors?: Record<string, string>; values?: Record<string, string> };

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  /*
   * Honeypot. A real person never fills a field they cannot see, but a
   * password manager might, and this used to redirect straight to the
   * thank-you page with the reference RFQ-0000-0000 without recording
   * anything at all. A buyer whose manager filled the hidden field got the
   * full success page, a reference number that looks exactly like a real one,
   * and a promised callback time, and then waited for a call that could never
   * come because the enquiry existed nowhere.
   *
   * For a business whose only pipeline is this form, silently discarding a
   * submission is the worst thing this file can do. So a trip no longer
   * discards. It flags, and the enquiry goes through the ordinary path, into
   * the log and into the email with the flag in the subject line. Spam volume
   * is a problem the client can solve later from a filtered inbox. A lost
   * lead cannot be solved at all.
   */
  const suspectedBot = Boolean(formData.get("confirm-order"));

  /*
   * Submission-time floor. Bots post instantly; people do not.
   *
   * The subtraction crosses two clocks: startedAt is stamped by the visitor's
   * browser and Date.now() is ours. If their phone is ahead of our server by
   * more than 2.5 seconds the difference is negative, which reads as "posted
   * faster than instantly" and blocked every attempt, permanently, with the
   * message "That was very quick. Give it a moment and try again." Waiting
   * cannot help when the gap is a constant clock offset, and a cheap Android
   * handset on a building site with no time sync is exactly the buyer this
   * site is built for.
   *
   * A negative elapsed says nothing about how long somebody spent on the
   * form, so it is no longer treated as evidence of anything. This does not
   * weaken the check: a bot could always omit the field entirely, which has
   * the same effect.
   */
  const startedAt = Number(formData.get("startedAt") ?? 0);
  const elapsed = Date.now() - startedAt;
  if (startedAt > 0 && elapsed >= 0 && elapsed < 2500) {
    return { errors: { form: "That was very quick. Give it a moment and try again." } };
  }

  const raw = {
    products: formData.getAll("products").map(String).filter((s) => SLUGS.includes(s) || s === "custom"),
    quantity: str(formData, "quantity"),
    quantityUnit: str(formData, "quantityUnit") || undefined,
    fulfilment: str(formData, "fulfilment") || "deliver",
    suburb: str(formData, "suburb"),
    needed: str(formData, "needed"),
    projectType: str(formData, "projectType"),
    name: str(formData, "name"),
    mobile: str(formData, "mobile"),
    company: str(formData, "company"),
    email: str(formData, "email"),
    contactPreference: str(formData, "contactPreference") || "whatsapp",
    notes: str(formData, "notes"),
    consent: str(formData, "consent"),
  };

  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    return { errors, values: flatten(raw) };
  }

  const now = new Date();
  const ref = reference(now, now.getTime());

  /*
   * 1. Record.
   *
   * STILL OUTSTANDING: this writes to the log, not to storage. For a business
   * whose only pipeline is this form, a dropped enquiry is the most expensive
   * failure on the site, and a log line ages out. Provisioning a store is the
   * client's call, so the guard below at least makes a misconfiguration loud
   * rather than silent.
   */
  const record = {
    ref,
    receivedAt: now.toISOString(),
    ...(suspectedBot ? { suspectedBot: true } : {}),
    ...parsed.data,
  };
  console.info("[enquiry]", JSON.stringify(record, null, 2));

  if (process.env.NODE_ENV === "production" && !process.env.RESEND_API_KEY) {
    console.error(
      `[enquiry] CRITICAL ${ref} exists only in this log line. RESEND_API_KEY is unset in production, so nobody has been told about it.`,
    );
  }

  // 2. Notify. Flagged submissions are delivered too, marked in the subject.
  await notify(record, suspectedBot);

  redirect(`/quote/thank-you?ref=${encodeURIComponent(ref)}`);
}

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function flatten(raw: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) out[key] = value.join(",");
    else if (typeof value === "string") out[key] = value;
  }
  return out;
}

async function notify(record: Record<string, unknown> & { ref: string }, suspectedBot = false) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO ?? COMPANY.email.value;

  if (!key || !to) {
    console.warn(
      `[enquiry] ${record.ref} not emailed: set RESEND_API_KEY and ENQUIRY_TO to deliver enquiries.`,
    );
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);

    await resend.emails.send({
      from: process.env.ENQUIRY_FROM ?? "Stonecrete Bricks <quotes@stonecretebricks.co.za>",
      to,
      subject: `${suspectedBot ? "[possible spam] " : ""}${record.ref}: quote request from ${String(record.name)}`,
      text: asText(record),
      replyTo: typeof record.email === "string" && record.email ? record.email : undefined,
    });
  } catch (error) {
    // Swallow, never fail the submit: the enquiry is already recorded above.
    console.error("[enquiry] email failed", record.ref, error);
  }
}

function asText(record: Record<string, unknown>): string {
  return Object.entries(record)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
    .join("\n");
}
