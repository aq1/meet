import "@/lib/sentry/instrument.server";

import { wrapFetchWithSentry } from "@sentry/tanstackstart-react";
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { createServerEntry } from "@tanstack/react-start/server-entry";
import { paraglideMiddleware } from "@/paraglide/server";

const handler = createStartHandler({
  handler: defaultStreamHandler,
  transformAssets: process.env.CDN_ORIGIN || "",
});

export default createServerEntry(
  wrapFetchWithSentry({
    fetch(request: Request) {
      return paraglideMiddleware(request, ({ request }) => handler(request));
    },
  }),
);
