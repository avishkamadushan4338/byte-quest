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
  organizerLogoPath: "/assets/sacoba-logo.webp",
  /** Published on the registration page (`REGISTRATION_OPENS_AT` / `_CLOSES_AT`). */
  registrationOpens: "2026-11-10",
  registrationCloses: "2027-01-10",
  eventName: "BYTE QUEST 2026",
  divisions: [
    { name: "Junior Division", grades: "Grades 6-8" },
    { name: "Senior Division", grades: "Grades 9-13" },
  ],
} as const;

/** Icons referenced by `<head>`, the web manifest and the checks. */
export const ICON_LINKS = [
  { rel: "icon", href: "/favicon.ico", sizes: "any" },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "48x48",
    href: "/favicon-48x48.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "192x192",
    href: "/icon-192x192.png",
  },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/site.webmanifest" },
] as const;

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
 * Site-wide Schema.org graph, repeated on every indexable page:
 *  - the website,
 *  - BYTE QUEST (the programme brand) and
 *  - the Old Boys' Association of St. Aloysius' College, Galle, its organiser.
 * No address, coordinates, social profiles or ratings are published until the
 * organisers confirm them.
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
      email: SITE_CONFIG.contactEmail,
      description:
        "An inter-school innovation and coding programme for Sri Lankan students, organised by the Old Boys' Association of St. Aloysius' College, Galle.",
      parentOrganization: { "@id": `${origin}/#organizer` },
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${origin}/#organizer`,
      name: SITE_CONFIG.organizer,
      logo: `${origin}${SITE_CONFIG.organizerLogoPath}`,
      email: SITE_CONFIG.contactEmail,
    },
  ],
});

/** `Event` node for the programme itself; dates are the published registration window. */
const buildEventNode = (origin: string) => ({
  "@type": "Event",
  "@id": `${origin}/#event`,
  name: SITE_CONFIG.eventName,
  description: `A three-month inter-school innovation and coding programme with Junior and Senior Divisions, two hackathons and a Grand Final. Registration opens on 10 November 2026 and closes on 10 January 2027; programme dates will be announced.`,
  url: absoluteUrl(origin, "/programme"),
  image: `${origin}${SITE_CONFIG.defaultImage.path}`,
  startDate: SITE_CONFIG.registrationOpens,
  eventStatus: "https://schema.org/EventScheduled",
  organizer: { "@id": `${origin}/#organizer` },
  inLanguage: SITE_CONFIG.language,
});

const buildBreadcrumbNode = (origin: string, url: string, name: string) => ({
  "@type": "BreadcrumbList",
  "@id": `${url}#breadcrumb`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
    { "@type": "ListItem", position: 2, name, item: url },
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
   * Per-page graph: a `WebPage` node tied back to the site-wide graph by `@id`,
   * a `BreadcrumbList` on inner pages and the `Event` on programme pages.
   */
  const isHome = normalizePath(page.canonicalPath ?? page.path) === "/";
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description: page.description,
        inLanguage: SITE_CONFIG.language,
        isPartOf: { "@id": `${origin}/#website` },
        ...(isHome ? {} : { breadcrumb: { "@id": `${url}#breadcrumb` } }),
      },
      ...(isHome ? [] : [buildBreadcrumbNode(origin, url, page.title)]),
      ...(page.describesProgramme ? [buildEventNode(origin)] : []),
    ],
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
 * `lastmod` is the build date (the content is code-defined, so a deploy is the
 * only moment it changes). It is omitted when no build date is known rather
 * than invented per request.
 */
export const buildSitemapXml = (origin: string, lastmod?: string): string => {
  const stamp = lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : "";
  const urls = getSitemapPages()
    .map(
      (page) =>
        `  <url>\n    <loc>${escapeXml(absoluteUrl(origin, page.path))}</loc>${stamp}\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

/**
 * `/api/` is operational and blocked. robots.txt is not access control: private
 * pages are protected by authentication and carry `noindex`, and are
 * intentionally left crawlable so that directive can be seen.
 */
export const AI_SEARCH_CRAWLERS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Claude-SearchBot",
  "Claude-User",
] as const;

export const buildRobotsTxt = (origin: string): string =>
  [
    "User-agent: *",
    "Disallow: /api/",
    "",
    "# AI search and assistant crawlers are explicitly welcome on public pages.",
    ...AI_SEARCH_CRAWLERS.map((bot) => `User-agent: ${bot}`),
    "Allow: /",
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
    ...SITE_CONFIG.divisions.map(
      (division) => `- ${division.name}: ${division.grades}.`
    ),
    "- Schools enter teams of 3-5 students with a teacher in charge.",
    "- Teams work through mentor-guided phases, two hackathons and a Grand Final.",
    "- School team registration opens on 10 November 2026 and closes on 10 January 2027.",
    "- Official programme dates (hackathons and Grand Final) have not been announced yet.",
    `- Motto: ${SITE_CONFIG.motto}.`,
    "",
    "## Contact",
    `- Organising committee: ${SITE_CONFIG.contactEmail}`,
    `- Organiser: ${SITE_CONFIG.organizer}`,
    "",
    "## Pages",
    ...getSitemapPages().map(
      (page) =>
        `- [${page.title}](${absoluteUrl(origin, page.path)}): ${page.description}`
    ),
    "",
  ].join("\n");
