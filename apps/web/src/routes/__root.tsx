import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  rootRouteId,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Suspense } from "react";
import { Toaster } from "sonner";

import type { orpc } from "@/utils/orpc";

import {
  AmbientGlow,
  generateAmbientBlobs,
} from "../components/site/ambient-glow";
import { MotionProvider, PageTransition } from "../components/site/motion";
import { SiteFooter } from "../components/site/site-footer";
import { SiteHeader } from "../components/site/site-header";
import { LoadingScreen } from "../components/status/loading-screen";
import { getProfile } from "../functions/get-profile";
import { getSiteOrigin } from "../functions/get-site-origin";
import { getUser } from "../functions/get-user";
import { NOT_FOUND_PATH, buildHeadForPath } from "../utils/seo";

import appCss from "../index.css?url";

const FONT_STYLESHEET =
  "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@700;800&display=swap";

export interface RouterAppContext {
  orpc: typeof orpc;
  queryClient: QueryClient;
}

const RootDocument = () => {
  const { ambientBlobs, isSignedIn, isAdmin } = Route.useLoaderData();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-ink text-fg min-h-svh">
        <AmbientGlow blobs={ambientBlobs} />
        {isAdminRoute ? null : (
          <SiteHeader isAdmin={isAdmin} isSignedIn={isSignedIn} />
        )}
        <Suspense fallback={<LoadingScreen />}>
          <MotionProvider>
            <PageTransition routeKey={pathname.split("/")[1] ?? ""}>
              <Outlet />
            </PageTransition>
          </MotionProvider>
        </Suspense>
        <SiteFooter />
        <Toaster richColors theme="dark" />
        {import.meta.env.DEV &&
        import.meta.env.VITE_SHOW_DEVTOOLS === "true" ? (
          <>
            <TanStackRouterDevtools position="bottom-left" />
            <ReactQueryDevtools
              buttonPosition="bottom-right"
              position="bottom"
            />
          </>
        ) : null}
        <Scripts />
      </body>
    </html>
  );
};

export const Route = createRootRouteWithContext<RouterAppContext>()({
  loader: async () => {
    const session = await getUser();
    const profile = session ? await getProfile() : null;
    return {
      ambientBlobs: generateAmbientBlobs(),
      isSignedIn: Boolean(session),
      isAdmin: profile?.role === "admin",
      siteOrigin: await getSiteOrigin(),
    };
  },
  head: ({ loaderData, matches }) => {
    // When nothing below the root matched (or a loader threw notFound) the
    // leaf is the root route itself, whose pathname is not a real page.
    const leaf = matches.at(-1);
    const isNotFound =
      !leaf || leaf.routeId === rootRouteId || leaf.status === "notFound";
    const seo = buildHeadForPath(
      isNotFound ? NOT_FOUND_PATH : leaf.pathname,
      loaderData?.siteOrigin
    );
    return {
      meta: [
        { charSet: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        ...seo.meta,
      ],
      scripts: seo.scripts,
      links: [
        ...seo.links,
        { rel: "stylesheet", href: appCss },
        { rel: "icon", type: "image/png", href: "/assets/favicon.png" },
        { rel: "shortcut icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/assets/favicon.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        { rel: "stylesheet", href: FONT_STYLESHEET },
      ],
    };
  },

  component: RootDocument,
});
