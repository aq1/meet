import * as Sentry from "@sentry/tanstackstart-react";
import { SENTRY_DSN } from "@/lib/sentry/config";

const isDev = import.meta.env.DEV;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: import.meta.env.MODE,
  release: __APP_VERSION__,
  tracesSampleRate: isDev ? 0 : 0.2,
  sendClientReports: false,
  beforeSend(event, hint) {
    if (isDev) {
      console.error("[sentry]", hint.originalException ?? event.message, event.tags ?? {}, event.extra ?? {});
      return null;
    }
    return event;
  },
});
