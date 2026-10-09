import { createFileRoute } from "@tanstack/react-router";

<<<<<<< HEAD
import { SITE_CONFIG } from "@/utils/seo";

type ChangeFreq = "daily" | "weekly" | "monthly" | "yearly";

interface SitemapEntry {
  path: string;
  changefreq: ChangeFreq;
  priority: number;
}

const PUBLIC_ROUTES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: 1 },
  { path: "/about", changefreq: "monthly", priority: 0.8 },
  { path: "/programme", changefreq: "monthly", priority: 0.8 },
  { path: "/journey", changefreq: "monthly", priority: 0.7 },
  { path: "/mentors", changefreq: "monthly", priority: 0.6 },
  { path: "/projects", changefreq: "weekly", priority: 0.7 },
  { path: "/partners", changefreq: "monthly", priority: 0.6 },
  { path: "/volunteers", changefreq: "monthly", priority: 0.6 },
  { path: "/register", changefreq: "weekly", priority: 0.9 },
  { path: "/code-of-conduct", changefreq: "yearly", priority: 0.3 },
  { path: "/submission-guidelines", changefreq: "yearly", priority: 0.4 },
  { path: "/privacy", changefreq: "yearly", priority: 0.3 },
  { path: "/terms", changefreq: "yearly", priority: 0.3 },
];

const buildSitemapXml = () => {
  const urls = PUBLIC_ROUTES.map(
    ({ path, changefreq, priority }) => `  <url>
    <loc>${SITE_CONFIG.url}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
};

/** Public, unauthenticated: machine-readable index of crawlable pages. */
=======
import { ENV } from "@/env.server";
import { buildSitemapXml, normalizeOrigin } from "@/utils/seo";

>>>>>>> 3fff91a (feat(seo): generate sitemap.xml and robots.txt from the route registry)
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
<<<<<<< HEAD
        new Response(buildSitemapXml(), {
          headers: {
            "Content-Type": "application/xml",
=======
        new Response(buildSitemapXml(normalizeOrigin(ENV.SITE_URL)), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
>>>>>>> 3fff91a (feat(seo): generate sitemap.xml and robots.txt from the route registry)
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
