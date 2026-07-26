import { COMPANY } from "@/data/company";
import { dateTime } from "./format";

/**
 * The response promise, as a real clock rather than "within 24 hours".
 *
 * Walks forward through business hours only, so a Friday afternoon enquiry
 * promises Monday morning rather than Saturday. Publishing a specific moment
 * is a much stronger signal than a vague window, which is exactly why it must
 * only ever be the window the client will actually honour.
 *
 * THE TIMEZONE, WHICH IS THE WHOLE STORY HERE.
 *
 * This walk used to read the clock with getDay() and getHours(), which are
 * server local time, and then hand the answer to dateTime() in format.ts,
 * which renders in Africa/Johannesburg. On a laptop in Polokwane those agree
 * and the bug is invisible. Vercel runs functions at TZ=UTC, and nothing in
 * next.config.ts or the env sets otherwise, so in production the walk ran two
 * hours behind the yard:
 *
 *   Saturday 11:00, enquiry sent   ->  promised "Saturday 25 July at 15:00"
 *   Thursday 15:00, enquiry sent   ->  promised "Thursday 23 July at 19:00"
 *
 * The yard shuts at 13:00 on a Saturday and 17:00 on a weekday. The first case
 * is wrong by two working days, and it is printed on the thank-you page under
 * the words "not a vague window", which is the single hardest promise the site
 * makes and the page where a buyer decides whether to believe any of it.
 *
 * So the walk no longer trusts the host clock. It shifts the instant into a
 * frame whose UTC fields ARE the Polokwane wall clock, walks there, and shifts
 * back. South Africa has never observed daylight saving since 1944 and SAST is
 * fixed at UTC+2, so this offset is exact rather than an approximation. That is
 * the one assumption in this file, and it is the reason a fixed number is safe
 * here where it would not be in most countries.
 *
 * scripts/response-time-check.mjs runs the same instants under TZ=UTC and
 * TZ=Africa/Johannesburg and fails if they ever disagree again.
 */

const OPEN_HOUR = 7;
const CLOSE_HOUR = 17;
const SAT_CLOSE_HOUR = 13;

/** SAST is UTC+2 year round. No DST since 1944. */
const SAST_OFFSET_MS = 2 * 3_600_000;

function closingHour(day: number): number {
  if (day === 0) return OPEN_HOUR; // Sunday, closed
  if (day === 6) return SAT_CLOSE_HOUR;
  return CLOSE_HOUR;
}

export function respondBy(from: Date, hours = COMPANY.responseHours.value ?? 4): Date {
  // Shifted so the UTC accessors below read the Polokwane wall clock.
  const cursor = new Date(from.getTime() + SAST_OFFSET_MS);
  let remaining = hours;

  // Guard against a pathological loop if the hours config is ever nonsense.
  for (let guard = 0; guard < 400 && remaining > 0; guard += 1) {
    const day = cursor.getUTCDay();
    const close = closingHour(day);

    if (day === 0 || cursor.getUTCHours() >= close) {
      // Jump to opening time on the next day.
      cursor.setUTCDate(cursor.getUTCDate() + 1);
      cursor.setUTCHours(OPEN_HOUR, 0, 0, 0);
      continue;
    }

    if (cursor.getUTCHours() < OPEN_HOUR) {
      cursor.setUTCHours(OPEN_HOUR, 0, 0, 0);
      continue;
    }

    const available = close - cursor.getUTCHours() - cursor.getUTCMinutes() / 60;

    if (available >= remaining) {
      cursor.setTime(cursor.getTime() + remaining * 3_600_000);
      remaining = 0;
    } else {
      remaining -= available;
      cursor.setUTCDate(cursor.getUTCDate() + 1);
      cursor.setUTCHours(OPEN_HOUR, 0, 0, 0);
    }
  }

  return new Date(cursor.getTime() - SAST_OFFSET_MS);
}

/** "Monday, 27 July 2026 at 12:00". */
export function respondByLabel(from: Date): string {
  return dateTime(respondBy(from));
}

/**
 * RFQ-2026-8K3F2M. A reference materially raises perceived legitimacy.
 *
 * The first version was `epochSeconds % 10000`, which repeats every 2.78 hours,
 * so two enquiries in a year would almost certainly collide. If the reference
 * ever becomes an operational key, that is a real problem. Base36 over the full
 * timestamp plus randomness gives a collision-free reference that is still
 * short enough to read down a phone.
 */
export function reference(now: Date, seed: number): string {
  const year = now.getFullYear();
  const stamp = Math.abs(Math.trunc(seed)).toString(36).toUpperCase().slice(-5);
  const salt = Math.floor(Math.random() * 36)
    .toString(36)
    .toUpperCase();
  return `RFQ-${year}-${stamp}${salt}`;
}
