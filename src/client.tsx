import * as Sentry from "@sentry/tanstackstart-react";
import { StartClient } from "@tanstack/react-start/client";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { SENTRY_DSN, SENTRY_TUNNEL_PATH } from "#/lib/sentry";

Sentry.init({
  dsn: SENTRY_DSN,
  tunnel: SENTRY_TUNNEL_PATH,
  enabled: import.meta.env.PROD,
  environment: import.meta.env.MODE,
  release: __APP_VERSION__,
  tracesSampleRate: 0.2,
  sendClientReports: false,
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>,
  );
});
