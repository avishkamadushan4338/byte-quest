import { createFileRoute } from "@tanstack/react-router";

import { clientIp, guardRequest } from "../../../lib/rate-limit";
import { auth } from "../../../services";

/** Transport-level budget; better-auth applies its own stricter per-path rules. */
const AUTH_LIMITS = {
  limit: 120,
  windowMs: 60_000,
  maxBodyBytes: 64 * 1024,
};

const handle = ({
  request,
}: {
  request: Request;
}): Response | Promise<Response> => {
  const guarded = guardRequest(
    request,
    `auth:${clientIp(request)}`,
    AUTH_LIMITS
  );
  if (guarded) {
    return guarded;
  }
  return auth.handler(request);
};

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
});
