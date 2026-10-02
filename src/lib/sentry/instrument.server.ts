import * as Sentry from "@sentry/tanstackstart-react";
import { SENTRY_DSN } from "@/lib/sentry/config";

Sentry.init({
  dsn: SENTRY_DSN,
  enabled: import.meta.env.PROD,
  environment: import.meta.env.MODE,
  release: __APP_VERSION__,
  tracesSampleRate: 0.2,
  enableLogs: true,
});
