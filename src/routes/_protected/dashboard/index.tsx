import { createFileRoute } from "@tanstack/react-router";
import { DownloadIcon, RouteIcon, VideoIcon } from "lucide-react";
import { listMyRoomsServerFn } from "@/apps/rooms/functions/list-my-rooms";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardPanel } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/_protected/dashboard/")({
  component: CallsPage,
  loader: () => listMyRoomsServerFn(),
});

type Room = Awaited<ReturnType<typeof listMyRoomsServerFn>>[number];

function CallsPage() {
  const rooms = Route.useLoaderData();
  const { user } = Route.useRouteContext();
  const viewerId = Number(user.id);

  return (
    <Card>
      <CardPanel>
        {rooms.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <RouteIcon />
              </EmptyMedia>
              <EmptyTitle>{m.dashboard_no_calls_title()}</EmptyTitle>
              <EmptyDescription>{m.dashboard_no_calls_description()}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="-mx-2 flex flex-col">
            {rooms.map((r) => (
              <li key={r.id}>
                <RoomRow room={r} viewerId={viewerId} />
              </li>
            ))}
          </ul>
        )}
      </CardPanel>
    </Card>
  );
}

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

function formatDuration(from: Date, to: Date) {
  const minutes = Math.max(1, Math.round((to.getTime() - from.getTime()) / 60000));
  if (minutes < 60) return m.dashboard_duration_minutes({ minutes });
  return m.dashboard_duration_hours({ hours: Math.floor(minutes / 60), minutes: minutes % 60 });
}

type RoomRowT = {
  viewerId: number;
  room: Room;
};

function RoomRow({ room, viewerId }: RoomRowT) {
  const createdAt = new Date(room.createdAt);
  const finishedAt = room.finishedAt ? new Date(room.finishedAt) : null;
  const participans = room.users
    .filter((u) => u.id !== viewerId)
    .map((u) => u.name)
    .join(", ");
  const title = participans.length ? m.dashboard_call_with({ participants: participans }) : m.dashboard_call();

  return (
    <div className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/50">
      <div className="flex min-w-0 flex-1 items-center gap-3 outline-none">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
          <VideoIcon className="size-4" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium font-mono text-sm">{title}</span>
          <span className="text-muted-foreground text-xs">
            {dateFormat.format(createdAt)}
            {finishedAt && ` · ${formatDuration(createdAt, finishedAt)}`}
          </span>
        </div>
        {finishedAt ? (
          <Badge variant="outline">{m.dashboard_room_ended()}</Badge>
        ) : (
          <Badge variant="success">{m.dashboard_room_active()}</Badge>
        )}
      </div>
      {room.egressUrl && (
        <a
          href={room.egressUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={m.dashboard_download_recording()}
          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        >
          <DownloadIcon />
        </a>
      )}
    </div>
  );
}
