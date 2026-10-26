import { createFileRoute } from "@tanstack/react-router";

import { ENV } from "@/env.server";
import { absoluteUrl, normalizeOrigin } from "@/utils/seo";

/** Common mistyped sitemap URL (e.g. in Search Console): permanent redirect. */
export const Route = createFileRoute("/sitemaps.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(null, {
          status: 301,
          headers: {
            Location: absoluteUrl(
              normalizeOrigin(ENV.SITE_URL),
              "/sitemap.xml"
            ),
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
