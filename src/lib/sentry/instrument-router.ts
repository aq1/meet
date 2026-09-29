import * as Sentry from "@sentry/tanstackstart-react";
import type { AnyRouter } from "@tanstack/react-router";

export function instrumentRouter(router: AnyRouter) {
  if (router.isServer) return;
  Sentry.addIntegration(Sentry.tanstackRouterBrowserTracingIntegration(router));
}
