/**
 * Re-runs every text and ground pair in the palette against WCAG AA.
 *
 *   node scripts/contrast-check.mjs
 *
 * The colour rules in docs/design-system.md are derived from this, not the
 * other way round. It is what caught Limestone on pure Oxide at 3.48:1 and
 * produced --oxide-deep. Run it before adding any colour pairing.
 *
 * Exits non-zero on a failure, so it can gate a deploy.
 */

const GRAPHITE = "#1a1a1a";
const OXIDE = "#d35a2a";
const UMBER = "#4a2f24";
const LIMESTONE = "#f2efea";
const CEMENT = "#8e8e8e";

const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const linear = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function luminance(hex) {
  const [r, g, b] = channels(hex).map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Matches how color-mix(in srgb, A p%, B) resolves in the browser. */
function mix(a, b, percent) {
  const A = channels(a);
  const B = channels(b);
  const p = percent / 100;
  return (
    "#" +
    A.map((c, i) =>
      Math.round((c * p + B[i] * (1 - p)) * 255)
        .toString(16)
        .padStart(2, "0"),
    ).join("")
  );
}

const inkSecondaryLight = mix(GRAPHITE, LIMESTONE, 68);
const oxideLift = mix(OXIDE, LIMESTONE, 88);
const oxideDeep = mix(OXIDE, GRAPHITE, 80);

// [name, foreground, background, minimum, mustFail?]. 4.5 for body text, 3.0
// for non-text and text at 24px or 18.66px bold and above.
//
// mustFail inverts the assertion: the pair is expected to be BELOW the floor,
// and the check fails if it ever climbs above it. That is how a rule like "no
// opacity modifier on the oxide field" stays enforced instead of being a
// comment someone deletes.
const PAIRS = [
  ["--ink on limestone", GRAPHITE, LIMESTONE, 4.5],
  ["--ink-secondary on limestone", inkSecondaryLight, LIMESTONE, 4.5],
  ["--ink-accent on limestone", UMBER, LIMESTONE, 4.5],
  ["--ink on graphite", LIMESTONE, GRAPHITE, 4.5],
  ["--ink-secondary on graphite", CEMENT, GRAPHITE, 4.5],
  ["--ink-accent on graphite", oxideLift, GRAPHITE, 4.5],
  ["limestone on --oxide-deep (buttons, oxide field)", LIMESTONE, oxideDeep, 4.5],
  // The oxide field has 0.21 of headroom, so an opacity modifier on text there
  // fails immediately. These two prove it rather than leaving it to memory.
  ["limestone/95 on --oxide-deep must NOT reach AA", mix(LIMESTONE, oxideDeep, 95), oxideDeep, 4.5, true],
  ["limestone/70 rule on --oxide-deep", mix(LIMESTONE, oxideDeep, 70), oxideDeep, 3.0],
  ["oxide rules on limestone", OXIDE, LIMESTONE, 3.0],
  ["oxide bars on graphite", OXIDE, GRAPHITE, 3.0],
  ["focus ring on limestone", OXIDE, LIMESTONE, 3.0],
  ["focus ring on graphite", OXIDE, GRAPHITE, 3.0],
  // Latent: an oxide field does not set --focus, so a focusable child would get
  // an oxide ring on oxide-deep. Neither field has one. If that changes, the
  // field must set --focus to limestone.
  ["focus ring inside an oxide field must NOT be used", OXIDE, oxideDeep, 3.0, true],
];

let failures = 0;

for (const [name, fg, bg, min, mustFail] of PAIRS) {
  const r = ratio(fg, bg);
  const pass = mustFail ? r < min : r >= min;
  if (!pass) failures += 1;
  console.log(
    `${pass ? "PASS" : "FAIL"}  ${name.padEnd(44)} ${r.toFixed(2).padStart(6)}  ${
      mustFail ? `must stay under ${min}` : `min ${min}`
    }`,
  );
}

console.log(`\n--oxide-deep resolves to ${oxideDeep}`);

// Documented as banned rather than tested as passing.
console.log(
  `Cement on limestone is ${ratio(CEMENT, LIMESTONE).toFixed(2)}:1, which is why it is hairlines only.`,
);

if (failures > 0) {
  console.error(`\n${failures} pair(s) below the minimum.`);
  process.exit(1);
}

console.log("\nEvery pair passes.");
