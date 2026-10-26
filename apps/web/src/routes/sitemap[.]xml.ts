import { createFileRoute } from "@tanstack/react-router";

import { ENV } from "@/env.server";
import { BUILD_DATE } from "@/utils/build-info";
import { buildSitemapXml, normalizeOrigin } from "@/utils/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          buildSitemapXml(normalizeOrigin(ENV.SITE_URL), BUILD_DATE),
          {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          }
        ),
    },
  },
});
