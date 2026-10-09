import { describe, expect, it } from "bun:test";
import { readdirSync, statSync } from "node:fs";
import nodePath from "node:path";

import {
  DEFAULT_SITE_ORIGIN,
  buildHeadForPath,
  buildJsonLd,
  buildRobotsTxt,
  buildSitemapXml,
  getSitemapPages,
  normalizeOrigin,
  serializeJsonLd,
} from "./seo";
import { normalizePath, privatePathPrefixes, seoPages } from "./seo-pages";

const ORIGIN = "https://example.test";
const ROUTES_DIR = nodePath.join(import.meta.dir, "..", "routes");
const LOC_PATTERN = /<loc>(?<url>[^<]+)<\/loc>/gu;
const ROOT_DISALLOW_PATTERN = /Disallow:\s*\/\s*$/mu;

const tagsNamed = (meta: Record<string, string>[], key: string) =>
  meta.filter((tag) => tag.name === key || tag.property === key);

const isPrivate = (path: string) =>
  privatePathPrefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );

/** Route files -> URL paths, mirroring TanStack file-based routing. */
const listRoutePaths = (dir = ROUTES_DIR): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const full = nodePath.join(dir, entry);
    if (statSync(full).isDirectory()) {
      return listRoutePaths(full);
    }
    const rel = nodePath.relative(ROUTES_DIR, full).replaceAll("\\", "/");
    const path = `/${rel
      .replace(/\.tsx?$/u, "")
      .replaceAll("[.]", ".")
      .replace(/\/index$/u, "")
      .replace(/^index$/u, "")}`;
    return [path === "/" ? "/" : path.replace(/\/$/u, "")];
  });

describe("origin handling", () => {
  it("falls back to the default origin for missing or unsafe values", () => {
    expect(normalizeOrigin()).toBe(DEFAULT_SITE_ORIGIN);
    expect(normalizeOrigin("data:text/html,hello")).toBe(DEFAULT_SITE_ORIGIN);
    expect(normalizeOrigin("not a url")).toBe(DEFAULT_SITE_ORIGIN);
  });

  it("strips paths and trailing slashes", () => {
    expect(normalizeOrigin("https://bytequest.example/some/path/")).toBe(
      "https://bytequest.example"
    );
  });

  it("normalises request paths", () => {
    expect(normalizePath("/about/")).toBe("/about");
    expect(normalizePath("/about?utm_source=x#top")).toBe("/about");
    expect(normalizePath("")).toBe("/");
  });
});

describe("registry", () => {
  it("has unique paths, titles and descriptions for indexable pages", () => {
    const indexable = seoPages.filter(
      (page) => page.indexable && !page.canonicalPath
    );
    for (const key of ["path", "title", "description"] as const) {
      const values = indexable.map((page) => page[key]);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it("accounts for every route file as public, private or an endpoint", () => {
    const registered = new Set(seoPages.map((page) => page.path));
    const unclassified = listRoutePaths().filter(
      (path) =>
        !registered.has(path) &&
        !path.startsWith("/api/") &&
        !path.endsWith(".xml") &&
        !path.endsWith(".txt") &&
        !isPrivate(path) &&
        path !== "/__root"
    );
    expect(unclassified).toEqual([]);
  });
});

describe("head tags", () => {
  const indexableCases = seoPages.filter((page) => page.indexable);

  it("renders one canonical, title and description per indexable page", () => {
    for (const page of indexableCases) {
      const { links, meta } = buildHeadForPath(page.path, ORIGIN);
      expect(links.filter((link) => link.rel === "canonical")).toHaveLength(1);
      expect(meta.filter((tag) => "title" in tag)).toHaveLength(1);
      expect(tagsNamed(meta, "description")).toHaveLength(1);
      expect(tagsNamed(meta, "robots")[0]?.content).toBe("index, follow");
    }
  });

  it("emits absolute, self-consistent canonical and og:url values", () => {
    for (const page of indexableCases) {
      const { links, meta } = buildHeadForPath(page.path, ORIGIN);
      const canonical = links.find((link) => link.rel === "canonical")?.href;
      expect(canonical?.startsWith(ORIGIN)).toBe(true);
      expect(new URL(canonical ?? "").search).toBe("");
      expect(tagsNamed(meta, "og:url")[0]?.content).toBe(canonical ?? "");
    }
  });

  it("canonicalises the duplicate volunteer page to /volunteers", () => {
    const { links } = buildHeadForPath("/register/volunteer", ORIGIN);
    expect(links[0]?.href).toBe(`${ORIGIN}/volunteers`);
  });

  it("ignores tracking parameters and trailing slashes", () => {
    const { links } = buildHeadForPath("/about/?utm_source=x", ORIGIN);
    expect(links[0]?.href).toBe(`${ORIGIN}/about`);
  });

  it("provides complete Open Graph and Twitter metadata", () => {
    const { meta } = buildHeadForPath("/about", ORIGIN);
    for (const key of [
      "og:site_name",
      "og:title",
      "og:description",
      "og:type",
      "og:url",
      "og:image",
      "og:image:alt",
      "twitter:card",
      "twitter:title",
      "twitter:description",
      "twitter:image",
      "twitter:image:alt",
    ]) {
      expect(tagsNamed(meta, key)).toHaveLength(1);
    }
    expect(tagsNamed(meta, "og:image")[0]?.content).toBe(
      `${ORIGIN}/assets/og-card.webp`
    );
  });

  it("marks placeholder, private and unknown paths noindex without canonicals", () => {
    for (const path of [
      "/mentors",
      "/projects",
      "/coming-soon",
      "/admin/users",
      "/dashboard",
      "/auth/login",
      "/register",
      "/does-not-exist",
    ]) {
      const { links, meta, scripts } = buildHeadForPath(path, ORIGIN);
      expect(tagsNamed(meta, "robots")[0]?.content).toBe("noindex, nofollow");
      expect(links).toHaveLength(0);
      expect(scripts).toHaveLength(0);
      expect(tagsNamed(meta, "og:url")).toHaveLength(0);
    }
  });
});

describe("structured data", () => {
  it("serialises to valid JSON that cannot close the script tag", () => {
    const hostile = "</script><script>alert(1)</script>";
    const raw = serializeJsonLd({ name: hostile });
    expect(raw).not.toContain("<");
    expect(JSON.parse(raw).name).toBe(hostile);
  });

  it("only uses types backed by verified facts, with stable ids", () => {
    const graph = buildJsonLd(ORIGIN)["@graph"];
    expect(graph.map((node) => node["@type"]).toSorted()).toEqual([
      "Organization",
      "WebSite",
    ]);
    expect(graph.map((node) => node["@id"])).toEqual([
      `${ORIGIN}/#website`,
      `${ORIGIN}/#organization`,
    ]);
    const serialised = JSON.stringify(graph);
    for (const forbidden of [
      "address",
      "geo",
      "sameAs",
      "aggregateRating",
      "Event",
    ]) {
      expect(serialised).not.toContain(forbidden);
    }
  });
});

describe("sitemap.xml and robots.txt", () => {
  it("lists exactly the indexable, self-canonical pages as absolute URLs", () => {
    const xml = buildSitemapXml(ORIGIN);
    const locs = [...xml.matchAll(LOC_PATTERN)].map(
      (match) => match.groups?.url
    );
    expect(locs).toEqual(
      getSitemapPages().map(
        (page) => `${ORIGIN}${page.path === "/" ? "/" : page.path}`
      )
    );
    expect(new Set(locs).size).toBe(locs.length);
  });

  it("excludes private, placeholder and duplicate routes", () => {
    const xml = buildSitemapXml(ORIGIN);
    for (const path of [
      "/mentors",
      "/projects",
      "/coming-soon",
      "/admin",
      "/dashboard",
      "/auth/login",
      "/register/volunteer",
      "/api",
    ]) {
      expect(xml).not.toContain(`${ORIGIN}${path}<`);
    }
    expect(xml).not.toContain("<lastmod>");
  });

  it("references the sitemap and keeps CMS images crawlable", () => {
    const txt = buildRobotsTxt(ORIGIN);
    expect(txt).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
    expect(txt).toContain("Allow: /api/cms/images/");
    expect(txt).toContain("Disallow: /api/");
    expect(txt).not.toMatch(ROOT_DISALLOW_PATTERN);
    expect(txt).not.toContain("localhost");
  });
});
