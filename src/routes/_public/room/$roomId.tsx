import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/room/$roomId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_public/room/$roomId"!</div>;
}
