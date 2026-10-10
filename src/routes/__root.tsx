import { setLogLevel as setComponentsLogLevel } from "@livekit/components-react";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { LogLevel, setLogLevel } from "livekit-client";
import { getSession } from "@/apps/auth/functions/get-session";
import { AnchoredToastProvider, ToastProvider } from "@/components/ui/toast";
import { m } from "@/paraglide/messages";
import { getLocale } from "@/paraglide/runtime";
import appCss from "../styles.css?url";

setLogLevel(LogLevel.warn);
setComponentsLogLevel("warn");

export const Route = createRootRoute({
  beforeLoad: async () => {
    const session = await getSession();
    return { user: session?.user ?? null };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: m.app_name(),
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <p>{m.not_found()}</p>,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()} className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="relative">
        <div className="relative isolate flex min-h-svh flex-col">
          <ToastProvider>
            <AnchoredToastProvider>
              <main>{children}</main>
            </AnchoredToastProvider>
          </ToastProvider>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
