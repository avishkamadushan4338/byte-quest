import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

import { BRAND_LOGO_SRC } from "@byte-quest/ui/components/brand";

const { join, relative, resolve, sep } = path;

const repoRoot = resolve(import.meta.dir, "../../..");
const publicDir = join(repoRoot, "apps", "web", "public");

const IGNORED_DIRS = new Set(["node_modules", ".output", ".tanstack"]);

const SOURCE_DIRS = [
  join(repoRoot, "apps", "web", "src"),
  join(repoRoot, "packages", "ui", "src"),
];

const walk = (dir: string): string[] => {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (IGNORED_DIRS.has(entry)) {
      continue;
    }
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full));
    } else if (
      /\.(?<ext>ts|tsx|css|html)$/u.test(entry) &&
      !/\.test\.tsx?$/u.test(entry)
    ) {
      out.push(full);
    }
  }
  return out;
};

/** Every `/assets/...` path referenced in source, mapped to the files using it. */
const referenced = new Map<string, string[]>();

const sourceFiles = SOURCE_DIRS.flatMap(walk);

for (const file of sourceFiles) {
  const contents = readFileSync(file, "utf-8");
  const at = relative(repoRoot, file).split(sep).join("/");
  for (const match of contents.matchAll(
    /(?<asset>\/assets\/[A-Za-z0-9._-]+)/gu
  )) {
    const assetPath = match.groups?.asset;
    if (assetPath) {
      referenced.set(assetPath, [...(referenced.get(assetPath) ?? []), at]);
    }
  }
}

/**
 * Every `/assets/...` reference has to exist on disk.
 *
 * These are plain public paths rather than bundled imports, so a rename or a
 * deleted file is invisible to the compiler and only shows up as a broken-image
 * icon at runtime. That happened before: a PNG->WebP conversion deleted
 * `bq-logo-mark.png` while `brand.tsx` kept pointing at it, and the brand
 * wordmark rendered as a broken image until the next release.
 */
describe("public asset references", () => {
  test("source actually references assets", () => {
    expect(referenced.size).toBeGreaterThan(0);
  });

  for (const [assetPath, sources] of referenced) {
    test(`${assetPath} exists`, () => {
      const onDisk = join(publicDir, assetPath.replaceAll("/", sep));
      expect(
        statSync(onDisk).isFile(),
        `${assetPath} is missing. Referenced by: ${[...new Set(sources)].join(", ")}`
      ).toBe(true);
    });
  }

  test("the brand logo is referenced and present", () => {
    expect(referenced.has(BRAND_LOGO_SRC)).toBe(true);
    expect(statSync(join(publicDir, BRAND_LOGO_SRC)).isFile()).toBe(true);
  });
});

/** Guards against an asset committed as an empty or truncated file. */
describe("public asset integrity", () => {
  const assetDir = join(publicDir, "assets");

  for (const name of readdirSync(assetDir)) {
    test(`${name} is a non-empty WebP`, () => {
      const bytes = readFileSync(join(assetDir, name));
      expect(bytes.byteLength).toBeGreaterThan(0);
      expect(bytes.subarray(0, 4).toString("ascii")).toBe("RIFF");
      expect(bytes.subarray(8, 12).toString("ascii")).toBe("WEBP");
    });
  }
});
