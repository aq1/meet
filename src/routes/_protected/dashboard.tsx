import { createFileRoute, Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { PlusIcon } from "lucide-react";
import { z } from "zod";
import { createRoomServerFn } from "@/apps/rooms/functions/create-room";
import { listMyRoomsServerFn } from "@/apps/rooms/functions/list-my-rooms";
import { AccountPanel } from "@/components/dashboard/AccountPanel";
import { CallsPanel } from "@/components/dashboard/CallsPanel";
import { FilesPanel } from "@/components/dashboard/FilesPanel";
import { Button } from "@/components/ui/button";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";
import { m } from "@/paraglide/messages";

const tabs = ["calls", "files", "account"] as const;

const tabLabels = {
  calls: m.dashboard_calls_title,
  files: m.dashboard_files_title,
  account: m.dashboard_account,
};

export const Route = createFileRoute("/_protected/dashboard")({
  validateSearch: z.object({
    tab: z.enum(tabs).optional().catch(undefined),
  }),
  component: DashboardPage,
  loader: () => listMyRoomsServerFn(),
});

function DashboardPage() {
  const navigate = useNavigate();
  const createRoomFn = useServerFn(createRoomServerFn);
  const rooms = Route.useLoaderData();
  const { user } = useRouteContext({ from: "/_protected" });
  const { tab: current = "calls" } = Route.useSearch();

  const createRoom = async () => {
    const { roomId } = await createRoomFn();
    navigate({ to: "/room/$roomId", params: { roomId } });
  };

  return (
    <div className="flex flex-col items-center py-4 px-4 lg:px-0">
      <div className="md:w-1/3 w-full flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="font-semibold text-lg">{m.dashboard_welcome()}</h1>
            <span className="text-muted-foreground text-sm">{m.dashboard_description()}</span>
          </div>
          <Button onClick={createRoom}>
            <PlusIcon />
            {m.create_room()}
          </Button>
        </div>
        <SegmentedControl aria-label={m.dashboard_description()} render={<nav />} size="lg" className="w-full">
          {tabs.map((tab) => (
            <SegmentedControlItem
              key={tab}
              className="grow"
              render={
                <Link
                  to="/dashboard"
                  search={{ tab }}
                  activeOptions={{ exact: true }}
                  resetScroll={false}
                  aria-current={tab === current ? "page" : undefined}
                />
              }
            >
              {tabLabels[tab]()}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
        {current === "calls" && <CallsPanel rooms={rooms} viewerId={Number(user.id)} />}
        {current === "files" && <FilesPanel />}
        {current === "account" && <AccountPanel user={user} />}
      </div>
    </div>
  );
}
