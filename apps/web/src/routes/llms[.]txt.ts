import { createFileRoute } from "@tanstack/react-router";

import { ENV } from "@/env.server";
import { buildLlmsTxt, normalizeOrigin } from "@/utils/seo";

/** Machine-readable site summary for AI assistants; see `buildLlmsTxt`. */
export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildLlmsTxt(normalizeOrigin(ENV.SITE_URL)), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
