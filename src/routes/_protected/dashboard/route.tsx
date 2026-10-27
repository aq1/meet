import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { PlusIcon } from "lucide-react";
import { createRoomServerFn } from "@/apps/rooms/functions/create-room";
import { Button } from "@/components/ui/button";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";
import { m } from "@/paraglide/messages";

const tabs = [
  { to: "/dashboard", label: m.dashboard_calls_title },
  { to: "/dashboard/files", label: m.dashboard_files_title },
  { to: "/dashboard/account", label: m.dashboard_account },
] as const;

export const Route = createFileRoute("/_protected/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();
  const createRoomFn = useServerFn(createRoomServerFn);

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
              key={tab.to}
              className="grow"
              render={<Link to={tab.to} activeOptions={{ exact: true }} resetScroll={false} />}
            >
              {tab.label()}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
        <Outlet />
        <span className="text-muted-foreground text-xs text-center">{__APP_VERSION__}</span>
      </div>
    </div>
  );
}
