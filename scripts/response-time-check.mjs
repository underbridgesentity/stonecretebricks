/**
 * Proves the response promise does not depend on the server's timezone.
 *
 *   node scripts/response-time-check.mjs
 *
 * This exists because it already broke once, silently, in the only place it
 * could not be noticed locally. The walk in src/lib/response-time.ts read
 * getHours(), which is server local time, while format.ts rendered the answer
 * in Africa/Johannesburg. Every developer machine here is SAST, so the two
 * agreed on every machine anyone tested on. Vercel runs functions at TZ=UTC,
 * where a Saturday 11:00 enquiry promised a callback at 15:00 on a day the
 * yard shuts at 13:00.
 *
 * The check runs the real module in a child process under several zones and
 * fails if any of them disagree with Africa/Johannesburg. It also asserts the
 * answer always lands inside trading hours, which is the property that
 * actually matters and would have caught the bug without knowing its cause.
 *
 * Exits non-zero on a failure, so it can gate a deploy.
 */

import { execFileSync } from "node:child_process";

const ZONES = ["Africa/Johannesburg", "UTC", "America/Los_Angeles", "Pacific/Kiritimati"];

/* Fixed instants, written as UTC so every zone is handed the same moment.
   Chosen for the edges: mid Saturday, late on a weekday, after Saturday close,
   Sunday, and the minute before opening. */
const CASES = [
  ["Saturday 11:00 SAST", "2026-07-25T09:00:00Z"],
  ["Thursday 15:00 SAST", "2026-07-23T13:00:00Z"],
  ["Saturday 14:00 SAST, after close", "2026-07-25T12:00:00Z"],
  ["Sunday 10:00 SAST", "2026-07-26T08:00:00Z"],
  ["Friday 16:00 SAST", "2026-07-24T14:00:00Z"],
  ["Monday 06:59 SAST, before open", "2026-07-27T04:59:00Z"],
];

const PROBE = `
import { respondBy } from "@/lib/response-time";
const out = ${JSON.stringify(CASES)}.map(([, iso]) => respondBy(new Date(iso)).toISOString());
console.log(JSON.stringify(out));
`;

const HOOK = new URL("./alias-hook.mjs", import.meta.url).href;

function run(tz) {
  const raw = execFileSync(
    process.execPath,
    ["--experimental-strip-types", "--no-warnings", "--import", HOOK, "--input-type=module", "-e", PROBE],
    { env: { ...process.env, TZ: tz }, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
  );
  return JSON.parse(raw.trim().split("\n").pop());
}

/** The property that matters: the promise lands inside trading hours. */
function insideTradingHours(iso) {
  const sast = new Date(new Date(iso).getTime() + 2 * 3_600_000);
  const day = sast.getUTCDay();
  const hour = sast.getUTCHours() + sast.getUTCMinutes() / 60;
  if (day === 0) return false; // Sunday
  const close = day === 6 ? 13 : 17;
  return hour >= 7 && hour <= close;
}

const baseline = run("Africa/Johannesburg");
let failures = 0;

for (const tz of ZONES) {
  const got = run(tz);
  for (let i = 0; i < CASES.length; i += 1) {
    const [label] = CASES[i];
    const drifted = got[i] !== baseline[i];
    if (drifted) {
      failures += 1;
      console.log(`FAIL  ${tz.padEnd(22)} ${label.padEnd(34)} ${got[i]}  expected ${baseline[i]}`);
    }
  }
}

for (let i = 0; i < CASES.length; i += 1) {
  const [label] = CASES[i];
  const ok = insideTradingHours(baseline[i]);
  if (!ok) failures += 1;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${label.padEnd(34)} -> ${baseline[i]}  ${
      ok ? "inside trading hours" : "OUTSIDE TRADING HOURS"
    }`,
  );
}

if (failures > 0) {
  console.error(`\n${failures} failure(s). The response promise is not timezone stable.`);
  process.exit(1);
}

console.log(`\nSame answer in all ${ZONES.length} zones, and every promise lands inside trading hours.`);
