import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";

import type { orpc } from "@/utils/orpc";

import {
  AmbientGlow,
  generateAmbientBlobs,
} from "../components/site/ambient-glow";
import { SiteFooter } from "../components/site/site-footer";
import { SiteHeader } from "../components/site/site-header";

import appCss from "../index.css?url";

const FONT_STYLESHEET =
  "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@700;800&display=swap";

export interface RouterAppContext {
  orpc: typeof orpc;
  queryClient: QueryClient;
}

const RootDocument = () => {
  const { ambientBlobs } = Route.useLoaderData();

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-ink text-fg min-h-svh">
        <AmbientGlow blobs={ambientBlobs} />
        <SiteHeader />
        <Outlet />
        <SiteFooter />
        <Toaster richColors theme="dark" />
        <TanStackRouterDevtools position="bottom-left" />
        <ReactQueryDevtools buttonPosition="bottom-right" position="bottom" />
        <Scripts />
      </body>
    </html>
  );
};

export const Route = createRootRouteWithContext<RouterAppContext>()({
  loader: () => ({ ambientBlobs: generateAmbientBlobs() }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "BYTE QUEST | St. Aloysius' College Galle",
      },
      {
        name: "description",
        content:
          "A national school innovation and coding programme empowering students to learn, build, innovate and inspire.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: FONT_STYLESHEET },
    ],
  }),

  component: RootDocument,
});
