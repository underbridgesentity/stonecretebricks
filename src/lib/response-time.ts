import { COMPANY } from "@/data/company";
import { dateTime } from "./format";

/**
 * The response promise, as a real clock rather than "within 24 hours".
 *
 * Walks forward through business hours only, so a Friday afternoon enquiry
 * promises Monday morning rather than Saturday. Publishing a specific moment
 * is a much stronger signal than a vague window, which is exactly why it must
 * only ever be the window the client will actually honour.
 */

const OPEN_HOUR = 7;
const CLOSE_HOUR = 17;
const SAT_CLOSE_HOUR = 13;

function closingHour(day: number): number {
  if (day === 0) return OPEN_HOUR; // Sunday, closed
  if (day === 6) return SAT_CLOSE_HOUR;
  return CLOSE_HOUR;
}

export function respondBy(from: Date, hours = COMPANY.responseHours.value ?? 4): Date {
  const cursor = new Date(from);
  let remaining = hours;

  // Guard against a pathological loop if the hours config is ever nonsense.
  for (let guard = 0; guard < 400 && remaining > 0; guard += 1) {
    const day = cursor.getDay();
    const close = closingHour(day);

    if (day === 0 || cursor.getHours() >= close) {
      // Jump to opening time on the next day.
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(OPEN_HOUR, 0, 0, 0);
      continue;
    }

    if (cursor.getHours() < OPEN_HOUR) {
      cursor.setHours(OPEN_HOUR, 0, 0, 0);
      continue;
    }

    const available = close - cursor.getHours() - cursor.getMinutes() / 60;

    if (available >= remaining) {
      cursor.setTime(cursor.getTime() + remaining * 3_600_000);
      remaining = 0;
    } else {
      remaining -= available;
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(OPEN_HOUR, 0, 0, 0);
    }
  }

  return cursor;
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
