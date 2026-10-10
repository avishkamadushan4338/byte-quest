import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { varlockVitePlugin } from "@varlock/vite-integration";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

/**
 * Defence-in-depth response headers for every route.
 *
 * The CSP deliberately keeps `script-src` at 'self' + 'unsafe-inline' (and
 * never 'unsafe-eval'): TanStack Router emits inline hydration bootstrap
 * scripts during SSR, while Zod runs in jitless mode (see lib/zod-csp.ts) so
 * no runtime code evaluation is needed anywhere.
 */
const securityHeaders = (mode: string) => {
  const devWebsockets =
    mode === "development" ? ["ws://localhost:*", "wss://localhost:*"] : [];

  return {
    "Content-Security-Policy": [
      "default-src 'self'",
      `connect-src 'self' ${devWebsockets.join(" ")}`.trim(),
      "font-src 'self' data: https://fonts.gstatic.com",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "img-src 'self' data: blob:",
      "object-src 'none'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "base-uri 'self'",
    ]
      .filter(Boolean)
      .join("; "),
    "Permissions-Policy":
      "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=31536000",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "0",
  };
};

export default defineConfig(({ mode }) => ({
  server: {
    port: 5001,
  },
  optimizeDeps: {
    include: [
      "use-sync-external-store/shim",
      "use-sync-external-store/shim/with-selector",
    ],
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    varlockVitePlugin({ ssrInjectMode: "auto-load" }),
    tailwindcss(),
    tanstackStart(),
    nitro({
      preset: "node-server",
      compressPublicAssets: true,
      // Defence in depth for private surfaces; pages also render a robots meta tag.
      routeRules: {
        "/**": { headers: securityHeaders(mode) },
        "/admin/**": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
        "/api/rpc/**": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
        "/api/auth/**": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
      },
    }),
    viteReact(),
  ],
}));
