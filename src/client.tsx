import * as Sentry from "@sentry/tanstackstart-react";
import { StartClient } from "@tanstack/react-start/client";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

Sentry.init({
  dsn: "https://75aeb57a82aec8e1d801e68e368c11b1@o233978.ingest.us.sentry.io/4512034310062080",
  enabled: import.meta.env.PROD,
  environment: import.meta.env.MODE,
  release: __APP_VERSION__,
  tracesSampleRate: 0.2,
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>,
  );
});
