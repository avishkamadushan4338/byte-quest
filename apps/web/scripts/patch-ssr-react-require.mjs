#!/usr/bin/env node
/**
 * Workaround for a known Nitro/Rolldown SSR bundling bug
 * (https://github.com/nitrojs/nitro/issues/4171).
 *
 * Packages that vendor `use-sync-external-store/shim` (e.g. @base-ui/react)
 * get split into an SSR chunk that calls the real Node `require("react")`
 * via `__require("react")`, instead of reusing the React copy Rolldown
 * already inlined into the chunk as `require_react()`. In the production
 * output (`.output/server`, no `node_modules` present at runtime, or a
 * second copy of React resolved from disk), this throws:
 *
 *   TypeError: null is not an object (evaluating
 *   'ReactSharedInternals.H.useSyncExternalStore')
 *
 * because the `__require("react")` call resolves a *different* React
 * module instance than the one whose dispatcher got set during render.
 *
 * Fix: rewrite `__require("react")` -> `require_react()` in any chunk that
 * already imports `require_react` locally, so the shim reuses the same
 * React instance as the rest of the chunk.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ssrDir = join(import.meta.dirname, "..", ".output", "server", "_ssr");

const files = await readdir(ssrDir).catch(() => []);

let patchedCount = 0;

for (const file of files) {
  if (!file.endsWith(".mjs")) {
    continue;
  }

  const filePath = join(ssrDir, file);
  const content = await readFile(filePath, "utf8");

  if (!(content.includes('__require("react")') && content.includes("require_react"))) {
    continue;
  }

  const patched = content.replaceAll('__require("react")', "require_react()");
  await writeFile(filePath, patched, "utf8");
  patchedCount += 1;
  console.log(`[patch-ssr-react-require] patched ${file}`);
}

if (patchedCount === 0) {
  console.log("[patch-ssr-react-require] no chunks required patching");
}
