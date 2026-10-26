/** Injected by `vite.config.ts` (`define`) as an ISO date (YYYY-MM-DD). */
declare const __BUILD_DATE__: string | undefined;

export const BUILD_DATE: string | undefined =
  typeof __BUILD_DATE__ === "string" ? __BUILD_DATE__ : undefined;
