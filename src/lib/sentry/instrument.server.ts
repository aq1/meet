import * as Sentry from "@sentry/tanstackstart-react";
import { SENTRY_DSN } from "@/lib/sentry/config";

const isDev = import.meta.env.DEV;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: import.meta.env.MODE,
  release: __COMMIT_HASH__,
  tracesSampleRate: isDev ? 0 : 0.2,
  enableLogs: true,
  beforeSend(event, hint) {
    const exception = hint.originalException;
    if (exception instanceof Response && exception.status < 500) {
      return null;
    }
    if (isDev) {
      console.error("[sentry]", hint.originalException ?? event.message, event.tags ?? {}, event.extra ?? {});
      return null;
    }
    return event;
  },
  beforeSendLog: (log) => (isDev ? null : log),
});
