import type { AnyRouter } from "@tanstack/react-router";

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
