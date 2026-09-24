import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Card, CardPanel } from "#/components/ui/card";
import { throwServerErrorServerFn } from "#/lib/debug/throw-server-error-server-fn";

export const Route = createFileRoute("/_protected/debug/sentry")({
  component: SentryDebugPage,
});

function RenderError(): never {
  throw new Error("Sentry test: client render error");
}

function SentryDebugPage() {
  const throwServerErrorFn = useServerFn(throwServerErrorServerFn);
  const [renderError, setRenderError] = useState(false);

  const throwHandlerError = () => {
    throw new Error("Sentry test: client handler error");
  };

  return (
    <div className="flex flex-col gap-4 items-center py-4">
      <Card className="w-full max-w-xs">
        <CardPanel>
          <div className="flex flex-col gap-2">
            <Button onClick={throwHandlerError}>Client handler error</Button>
            <Button onClick={() => setRenderError(true)}>Client render error</Button>
            <Button onClick={() => throwServerErrorFn()}>Server error</Button>
          </div>
        </CardPanel>
      </Card>
      {renderError && <RenderError />}
    </div>
  );
}
