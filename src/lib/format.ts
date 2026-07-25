/**
 * South African formatting. Money R12 500.00 with a space thousands separator
 * and a point decimal. Dates 24 May 2026. Times 24-hour.
 */

const SPACE = " ";

/** 12500 -> "12 500". Non-breaking space, so a figure never wraps mid-number. */
export function number(value: number, decimals = 0): string {
  const fixed = value.toFixed(decimals);
  const [whole = "0", fraction] = fixed.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, SPACE);
  return fraction ? `${grouped}.${fraction}` : grouped;
}

/** 12500 -> "R12 500.00". */
export function money(value: number): string {
  return `R${number(value, 2)}`;
}

/** 24 May 2026. */
export function date(value: Date): string {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Johannesburg",
  }).format(value);
}

/** Monday, 27 July 2026 at 12:00. Used for the response promise. */
export function dateTime(value: Date): string {
  const day = new Intl.DateTimeFormat("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Johannesburg",
  }).format(value);

  const time = new Intl.DateTimeFormat("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Johannesburg",
  }).format(value);

  return `${day} at ${time}`;
}
