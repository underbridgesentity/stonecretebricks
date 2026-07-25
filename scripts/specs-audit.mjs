/**
 * Lists every fact the client still owes us.
 *
 * This is the content-gaps document as an executable checklist, so it cannot
 * drift out of date the way a document does. Run it before every client call.
 *
 *   pnpm specs:audit
 *
 * Exits non-zero when a blocking fact is still outstanding, so CI or a
 * pre-deploy step can gate on it.
 */

import { outstandingFacts } from "../src/data/company.ts";
import { outstandingSpecs } from "../src/data/products.ts";

const facts = outstandingFacts();
const specs = outstandingSpecs();

const blocking = facts.filter((f) => f.blocking);
const optional = facts.filter((f) => !f.blocking);

function heading(text) {
  console.log(`\n${text}\n${"-".repeat(text.length)}`);
}

heading(`Blocking company facts (${blocking.length})`);
if (blocking.length === 0) {
  console.log("None. Every blocking fact is filled in.");
} else {
  for (const f of blocking) console.log(`  ${f.path.padEnd(28)} ${f.source}`);
}

heading(`Non-blocking company facts (${optional.length})`);
if (optional.length === 0) {
  console.log("None.");
} else {
  for (const f of optional) console.log(`  ${f.path.padEnd(28)} ${f.source}`);
}

heading(`Product figures awaiting confirmation (${specs.length})`);
const byProduct = new Map();
for (const s of specs) {
  if (!byProduct.has(s.product)) byProduct.set(s.product, []);
  byProduct.get(s.product).push(s);
}
for (const [product, rows] of byProduct) {
  console.log(`\n  ${product}`);
  for (const r of rows) console.log(`    ${r.field.padEnd(18)} ${r.source}`);
}

console.log(
  `\n${blocking.length} blocking, ${optional.length} optional, ${specs.length} product figures.\n`,
);

if (blocking.length > 0) {
  console.log("Blocking facts outstanding. The site can run locally but must not go live.\n");
  process.exit(1);
}
