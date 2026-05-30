import { createFileRoute } from "@tanstack/react-router";
import { Piano } from "#/components/Piano";
import { Controls } from "#/components/Controls";
import { Panel } from "#/components/Panel";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex gap-6 h-dvh w-dvw">
      <div
        className="grow flex flex-col gap-6 justify-end h-full"
        style={{ minWidth: 0 }}
      >
        <div className="h-fit w-full flex justify-center">
          <Controls />
        </div>
        <Piano />
      </div>
      <Panel />
    </div>
  );
}
