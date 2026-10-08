import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { ErrorPage } from "./components/status/error-page";
import { LoadingScreen } from "./components/status/loading-screen";
import { NotFoundPage } from "./components/status/not-found-page";
import { routeTree } from "./routeTree.gen";
import { createQueryClient, orpc } from "./utils/orpc";

export const getRouter = () => {
  const queryClient = createQueryClient();

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    scrollRestorationBehavior: "instant",
    defaultPreloadStaleTime: 0,
    context: { orpc, queryClient },
    defaultPendingComponent: LoadingScreen,
    defaultPendingMs: 0,
    defaultPendingMinMs: 1200,
    defaultNotFoundComponent: NotFoundPage,
    defaultErrorComponent: ErrorPage,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
