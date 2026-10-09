import { createFileRoute } from "@tanstack/react-router";

import { ENV } from "@/env.server";
import { buildRobotsTxt, normalizeOrigin } from "@/utils/seo";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildRobotsTxt(normalizeOrigin(ENV.SITE_URL)), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
