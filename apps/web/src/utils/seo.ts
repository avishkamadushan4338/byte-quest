import { findPage, isKnownPath, normalizePath, seoPages } from "./seo-pages";
import type { SeoPage } from "./seo-pages";

/**
 * Single source of truth for site-wide SEO identity and for every tag, sitemap
 * entry and robots rule derived from it. Per-page copy lives in `seo-pages.ts`.
 *
 * The production origin is NOT hard-coded into tags: it is resolved at runtime
 * from the `SITE_URL` environment variable (see `functions/get-site-origin.ts`)
 * and falls back to `DEFAULT_SITE_ORIGIN`, the host the production compose file
 * deploys to.
 */
export const DEFAULT_SITE_ORIGIN = "https://bytequest.aloysiuscollege.lk";

export const SITE_CONFIG = {
  name: "BYTE QUEST",
  institution: "St. Aloysius' College, Galle",
  organizer: "Old Boys' Association of St. Aloysius' College, Galle",
  language: "en",
  locale: "en_LK",
  titleSuffix: " | BYTE QUEST",
  contactEmail: "bytequest@aloysiuscollege.lk",
  motto: "CERTA VIRILITER",
  defaultImage: {
    path: "/assets/og-card.webp",
    width: 1200,
    height: 630,
    alt: "BYTE QUEST - Learn. Build. Innovate. Inspire.",
  },
  logoPath: "/assets/bq-logo.webp",
} as const;

export type MetaTag = Record<string, string>;
export type LinkTag = Record<string, string>;

export interface HeadTags {
  links: LinkTag[];
  meta: MetaTag[];
  scripts: { type: string; children: string }[];
}

/** Returns a clean `https://host[:port]` origin, or the default for bad input. */
export const normalizeOrigin = (raw?: string | null): string => {
  if (!raw) {
    return DEFAULT_SITE_ORIGIN;
  }
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return DEFAULT_SITE_ORIGIN;
    }
    return url.origin;
  } catch {
    return DEFAULT_SITE_ORIGIN;
  }
};

export const absoluteUrl = (origin: string, path: string): string => {
  const normalized = normalizePath(path);
  return normalized === "/" ? `${origin}/` : `${origin}${normalized}`;
};

const withSuffix = (page: SeoPage) =>
  page.absoluteTitle ? page.title : `${page.title}${SITE_CONFIG.titleSuffix}`;

/** Sentinel path for requests that matched no route; never a real URL. */
export const NOT_FOUND_PATH = "/__not-found__";

const NOT_FOUND_TITLE = `Page not found${SITE_CONFIG.titleSuffix}`;
const PRIVATE_TITLE = `BYTE QUEST`;

/** Escapes characters that could terminate an inline JSON-LD script block. */
export const serializeJsonLd = (data: unknown): string =>
  JSON.stringify(data)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");

/**
 * Schema.org graph that only states verified facts:
 *  - the website, and
 *  - BYTE QUEST as an Organization (the programme brand).
 * The school and the OBA are deliberately NOT asserted to be the same entity as
 * BYTE QUEST, and no address, coordinates, social profiles, events or ratings
 * are published until the organisers confirm them.
 */
export const buildJsonLd = (origin: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: origin,
      name: SITE_CONFIG.name,
      inLanguage: SITE_CONFIG.language,
      publisher: { "@id": `${origin}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      name: SITE_CONFIG.name,
      url: origin,
      logo: `${origin}${SITE_CONFIG.logoPath}`,
      description:
        "An inter-school innovation and coding programme for Sri Lankan students, organised by the Old Boys' Association of St. Aloysius' College, Galle.",
    },
  ],
});

const buildSocialTags = ({
  description,
  origin,
  title,
  url,
}: {
  description: string;
  origin: string;
  title: string;
  url: string;
}): MetaTag[] => {
  const image = `${origin}${SITE_CONFIG.defaultImage.path}`;
  return [
    { property: "og:site_name", content: SITE_CONFIG.name },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: SITE_CONFIG.locale },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    {
      property: "og:image:width",
      content: String(SITE_CONFIG.defaultImage.width),
    },
    {
      property: "og:image:height",
      content: String(SITE_CONFIG.defaultImage.height),
    },
    { property: "og:image:alt", content: SITE_CONFIG.defaultImage.alt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: SITE_CONFIG.defaultImage.alt },
  ];
};

/**
 * Builds the complete document head for a pathname. This is the only place that
 * emits title, description, canonical, robots, Open Graph and JSON-LD, so the
 * tags cannot conflict. Unknown paths (404s) and non-indexable pages get
 * `noindex` and never a canonical.
 */
export const buildHeadForPath = (
  rawPath: string,
  origin: string = DEFAULT_SITE_ORIGIN
): HeadTags => {
  const path = normalizePath(rawPath);
  const page = findPage(path);
  const scripts = [
    {
      type: "application/ld+json",
      children: serializeJsonLd(buildJsonLd(origin)),
    },
  ];

  if (!page) {
    const known = isKnownPath(path);
    return {
      links: [],
      meta: [
        { title: known ? PRIVATE_TITLE : NOT_FOUND_TITLE },
        { name: "robots", content: "noindex, nofollow" },
      ],
      scripts: [],
    };
  }

  const title = withSuffix(page);
  const url = absoluteUrl(origin, page.canonicalPath ?? page.path);

  if (!page.indexable) {
    return {
      links: [],
      meta: [
        { title },
        { name: "description", content: page.description },
        { name: "robots", content: "noindex, nofollow" },
      ],
      scripts: [],
    };
  }

  /**
   * Per-page `WebPage` node: gives crawlers and generative engines a
   * self-contained, machine-readable description of this exact URL and ties it
   * back to the site-wide `WebSite` / `Organization` graph by `@id`.
   */
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description: page.description,
    inLanguage: SITE_CONFIG.language,
    isPartOf: { "@id": `${origin}/#website` },
  };

  return {
    links: [{ rel: "canonical", href: url }],
    meta: [
      { title },
      { name: "description", content: page.description },
      { name: "robots", content: "index, follow" },
      ...buildSocialTags({ description: page.description, origin, title, url }),
    ],
    scripts: [
      ...scripts,
      { type: "application/ld+json", children: serializeJsonLd(pageJsonLd) },
    ],
  };
};

/** Pages that belong in sitemap.xml: indexable and self-canonical. */
export const getSitemapPages = (): SeoPage[] =>
  seoPages.filter(
    (page) =>
      page.indexable &&
      (page.canonicalPath === undefined || page.canonicalPath === page.path)
  );

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

/**
 * No `<lastmod>` is emitted: the content is code-defined, so there is no
 * trustworthy per-page modification date and an artificial one would be noise.
 */
export const buildSitemapXml = (origin: string): string => {
  const urls = getSitemapPages()
    .map(
      (page) =>
        `  <url>\n    <loc>${escapeXml(absoluteUrl(origin, page.path))}</loc>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

/**
 * `/api/` is operational and blocked. robots.txt is not access control: private
 * pages are protected by authentication and carry `noindex`, and are
 * intentionally left crawlable so that directive can be seen.
 */
export const buildRobotsTxt = (origin: string): string =>
  [
    "User-agent: *",
    "Disallow: /api/",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n");

/**
 * `llms.txt` (the llmstxt.org convention): a plain-text summary for generative
 * engines, served at `/llms.txt`. Every statement below is already published
 * somewhere on the site, and the page list is derived from the same registry
 * that drives sitemap.xml, so the two can never drift apart. Private and
 * placeholder routes are never listed.
 */
export const buildLlmsTxt = (origin: string): string =>
  [
    `# ${SITE_CONFIG.name}`,
    "",
    `> ${findPage("/")?.description ?? ""}`,
    "",
    "## Key facts",
    "- Organised by the Old Boys' Association of St. Aloysius' College, Galle (SACOBA).",
    "- A three-month inter-school innovation and coding programme for students in Grades 6-13 in Sri Lanka.",
    "- Schools enter teams of 3-5 students with a teacher in charge, in Junior and Senior Divisions.",
    "- Teams work through mentor-guided phases, two hackathons and a Grand Final.",
    "- School team registration opens on 10 November 2026.",
    `- Motto: ${SITE_CONFIG.motto}.`,
    "",
    "## Contact",
    `- Organising committee: ${SITE_CONFIG.contactEmail}`,
    "",
    "## Pages",
    ...getSitemapPages().map(
      (page) =>
        `- [${page.title}](${absoluteUrl(origin, page.path)}): ${page.description}`
    ),
    "",
  ].join("\n");
