/**
 * Teaches plain Node the "@/" path alias that tsconfig gives the app.
 *
 *   node --experimental-strip-types --import ./scripts/alias-hook.mjs some-script.mjs
 *
 * scripts/specs-audit.mjs gets away without this because it only reaches
 * src/data, and those two files import nothing but each other by relative
 * path. Anything further into src hits "@/..." and Node treats it as a bare
 * package specifier, so it goes looking for a node_modules folder called "@".
 *
 * Rather than rewriting source imports to suit the tooling, the tooling learns
 * the alias. Keep this in step with the "paths" entry in tsconfig.json.
 */

import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = new URL("../src/", import.meta.url);

/**
 * Two jobs, because TypeScript's bundler resolution is looser than Node's in
 * two ways and the app source uses both. "@/lib/format" is the alias, and
 * "./format" is extensionless, which Node ESM refuses on relative specifiers.
 */
function firstThatExists(base) {
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`]) {
    const path = fileURLToPath(candidate);
    if (existsSync(path) && !path.endsWith("/")) return pathToFileURL(path).href;
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const found = firstThatExists(new URL(specifier.slice(2), SRC).href);
      if (!found) throw new Error(`alias-hook: cannot resolve ${specifier} under ${SRC.href}`);
      return { url: found, shortCircuit: true };
    }

    if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL) {
      const found = firstThatExists(new URL(specifier, context.parentURL).href);
      if (found) return { url: found, shortCircuit: true };
    }

    return nextResolve(specifier, context);
  },
});
