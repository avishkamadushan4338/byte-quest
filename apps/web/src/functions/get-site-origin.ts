import { createServerFn } from "@tanstack/react-start";

import { ENV } from "@/env.server";
import { normalizeOrigin } from "@/utils/seo";

/** Canonical public origin, resolved from `SITE_URL` (see utils/seo.ts). */
export const getSiteOrigin = createServerFn({ method: "GET" }).handler(() =>
  normalizeOrigin(ENV.SITE_URL)
);
