export interface SeoMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}

export const SITE_CONFIG = {
  name: "BYTE QUEST",
  fullName: "BYTE QUEST - National School Innovation & Coding Programme",
  institution: "St. Aloysius' College Galle",
  organizer: "SACOBA - Old Boys' Association, St. Aloysius' College",
  description:
    "A premier national school innovation and coding programme in Sri Lanka, empowering students to learn, build, innovate and inspire.",
  url: "https://bytequest.aloysiuscollege.lk",
  defaultImage: "/assets/crest.webp",
  locale: "en_LK",
  geo: {
    /** Southern Province / Galle District */
    region: "LK-31",
    placename: "Galle, Sri Lanka",
    position: "6.0367;80.2170",
    icbm: "6.0367, 80.2170",
  },
};

/**
 * Generates an array of TanStack Router meta tags with complete SEO,
 * Geo targeting, Open Graph, and Twitter Cards specifications.
 */
export const buildSeoMeta = (options?: SeoMetadataOptions) => {
  const title = options?.title
    ? `${options.title} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} | ${SITE_CONFIG.institution}`;

  const description = options?.description ?? SITE_CONFIG.description;
  const url = options?.path
    ? `${SITE_CONFIG.url}${options.path.startsWith("/") ? "" : "/"}${options.path}`
    : SITE_CONFIG.url;
  const image = options?.image ?? SITE_CONFIG.defaultImage;
  const absoluteImage = image.startsWith("http")
    ? image
    : `${SITE_CONFIG.url}${image.startsWith("/") ? "" : "/"}${image}`;

  return [
    // Basic Meta
    { title },
    { name: "description", content: description },

    // Geo Targeting (Galle, Sri Lanka)
    { name: "geo.region", content: SITE_CONFIG.geo.region },
    { name: "geo.placename", content: SITE_CONFIG.geo.placename },
    { name: "geo.position", content: SITE_CONFIG.geo.position },
    { name: "ICBM", content: SITE_CONFIG.geo.icbm },

    // Open Graph
    { property: "og:site_name", content: SITE_CONFIG.name },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: options?.type ?? "website" },
    { property: "og:locale", content: SITE_CONFIG.locale },
    { property: "og:image", content: absoluteImage },
    { property: "og:image:alt", content: title },

    // Twitter Cards
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: absoluteImage },
  ];
};

/**
 * Returns the canonical `<link>` tag for a route path, preventing duplicate-
 * content SEO penalties across trailing-slash/query-string variants.
 */
export const buildCanonicalLink = (path?: string) => ({
  rel: "canonical",
  href: path
    ? `${SITE_CONFIG.url}${path.startsWith("/") ? "" : "/"}${path}`
    : SITE_CONFIG.url,
});

/**
 * Returns structured schema.org JSON-LD for Search Engine Knowledge Graphs.
 */
export const getOrganizationJsonLd = () =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_CONFIG.name,
    legalName: "Byte Quest - St. Aloysius' College Galle",
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/assets/crest.webp`,
    description: SITE_CONFIG.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Galle",
      addressRegion: "Southern Province",
      postalCode: "80000",
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "6.0367",
      longitude: "80.2170",
    },
    sameAs: ["https://facebook.com", "https://instagram.com"],
  });
