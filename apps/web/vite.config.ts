import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { varlockVitePlugin } from "@varlock/vite-integration";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
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
        "/admin/**": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
        "/api/rpc/**": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
        "/api/auth/**": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
      },
    }),
    viteReact(),
  ],
  ssr: {
    external: ["sharp"],
  },
});
