import type { AnyRouter } from "@tanstack/react-router";

export const SENTRY_DSN =
  "https://75aeb57a82aec8e1d801e68e368c11b1@o233978.ingest.us.sentry.io/4512034310062080";

export const SENTRY_TUNNEL_PATH = "/api/sentry";

export async function captureException(error: unknown) {
  if (import.meta.env.SSR) return;
  const Sentry = await import("@sentry/tanstackstart-react");
  Sentry.captureException(error);
}

export async function instrumentRouter(router: AnyRouter) {
  if (import.meta.env.SSR) return;
  const Sentry = await import("@sentry/tanstackstart-react");
  Sentry.addIntegration(Sentry.tanstackRouterBrowserTracingIntegration(router));
}
