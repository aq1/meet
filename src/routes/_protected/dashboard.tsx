import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ChevronRightIcon, DownloadIcon, PlusIcon, RouteIcon, UserIcon, VideoIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button, buttonVariants } from "#/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "#/components/ui/empty";
import { Field, FieldLabel } from "#/components/ui/field";
import { Form } from "#/components/ui/form";
import { createRoomServerFn } from "#/lib/rooms/create-room-server-fn";
import { listMyRoomsServerFn } from "#/lib/rooms/list-my-rooms-fn";
import {
  Card,
  CardFrame,
  CardFrameAction,
  CardFrameDescription,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from "@/components/ui/card";

export const Route = createFileRoute("/_protected/dashboard")({
  component: DashboardPage,
  loader: () => listMyRoomsServerFn(),
});

function DashboardPage() {
  const navigate = useNavigate();
  const createRoomFn = useServerFn(createRoomServerFn);
  const rooms = Route.useLoaderData();

  const createRoom = async () => {
    const { roomId } = await createRoomFn();
    navigate({ to: "/room/$roomId", params: { roomId } });
  };

  return (
    <div className="flex flex-col items-center py-4">
      <div className="md:w-1/3 w-full flex flex-col gap-4">
        <CardFrame>
          <CardFrameHeader>
            <CardFrameTitle>Welcome</CardFrameTitle>
            <CardFrameDescription>Manage your profile here (later)</CardFrameDescription>
            <CardFrameAction>
              <Button onClick={createRoom}>
                <PlusIcon />
                Create room
              </Button>
            </CardFrameAction>
          </CardFrameHeader>
          <Card className="hidden">
            <CardPanel>
              <Form className="flex w-full flex-col gap-4">
                <Field name="name">
                  <div className="flex gap-4">
                    <Avatar className="size-16">
                      <AvatarFallback>
                        <UserIcon className="size-8" />
                      </AvatarFallback>
                    </Avatar>
                    <FieldLabel>Click to change profile image</FieldLabel>
                  </div>
                </Field>
              </Form>
            </CardPanel>
          </Card>
        </CardFrame>
        <CardFrame className="hidden">
          <CardFrameHeader>
            <CardFrameTitle>History</CardFrameTitle>
            <CardFrameDescription>Your recent rooms</CardFrameDescription>
          </CardFrameHeader>
          <Card>
            <CardPanel>
              {rooms.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <RouteIcon />
                    </EmptyMedia>
                    <EmptyTitle>No calls yet</EmptyTitle>
                    <EmptyDescription>Get started by creating your first room.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <ul className="-mx-2 flex flex-col">
                  {rooms.map((r) => (
                    <li key={r.id}>
                      <RoomRow room={r} />
                    </li>
                  ))}
                </ul>
              )}
            </CardPanel>
          </Card>
        </CardFrame>
      </div>
    </div>
  );
}

type RoomItem = ReturnType<typeof Route.useLoaderData>[number];

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

function formatDuration(from: Date, to: Date) {
  const minutes = Math.max(1, Math.round((to.getTime() - from.getTime()) / 60000));
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

function RoomRow({ room }: { room: RoomItem }) {
  const createdAt = new Date(room.createdAt);
  const finishedAt = room.finishedAt ? new Date(room.finishedAt) : null;

  return (
    <div className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/50">
      <Link
        to="/room/$roomId"
        params={{ roomId: room.publicId }}
        className="flex min-w-0 flex-1 items-center gap-3 outline-none"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
          <VideoIcon className="size-4" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium font-mono text-sm">{room.publicId}</span>
          <span className="text-muted-foreground text-xs">
            {dateFormat.format(createdAt)}
            {finishedAt && ` · ${formatDuration(createdAt, finishedAt)}`}
          </span>
        </div>
        {finishedAt ? <Badge variant="outline">Ended</Badge> : <Badge variant="success">Active</Badge>}
      </Link>
      {room.egressUrl && (
        <a
          href={room.egressUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Download recording"
          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        >
          <DownloadIcon />
        </a>
      )}
      <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
    </div>
  );
}
