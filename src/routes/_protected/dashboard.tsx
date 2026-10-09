import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createFileRoute, useNavigate, useRouteContext, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CircleAlertIcon, DownloadIcon, PlusIcon, RouteIcon, UserIcon, VideoIcon } from "lucide-react";
import { createRoomServerFn } from "@/apps/rooms/functions/create-room";
import { listMyRoomsServerFn } from "@/apps/rooms/functions/list-my-rooms";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardFrame,
  CardFrameAction,
  CardFrameDescription,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { useState, type ChangeEvent, type SubmitEvent } from "react";

export const Route = createFileRoute("/_protected/dashboard")({
  component: DashboardPage,
  loader: () => listMyRoomsServerFn(),
});

function DashboardPage() {
  const navigate = useNavigate();
  const createRoomFn = useServerFn(createRoomServerFn);
  const rooms = Route.useLoaderData();
  const router = useRouter();
  const { user: authUser } = useRouteContext({ from: "/_protected" });
  const [user, setUser] = useState(authUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const maskedEmail = user.email.replace(/^(.)[^@]*/, "$1***");

  const createRoom = async () => {
    const { roomId } = await createRoomFn();
    navigate({ to: "/room/$roomId", params: { roomId } });
  };

  const deletePhoto = () => {
    setUser((p) => {
      return { ...p, image: "" };
    });
  };

  const changePhoto = () => {};

  const changeName = (e: ChangeEvent<HTMLInputElement>) => {
    setUser((p) => {
      return { ...p, name: e.target.value };
    });
  };

  const logOut = async () => {
    await authClient.signOut();
    await router.invalidate();
    navigate({ to: "/" });
  };

  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      throw new Error();
      const result = await authClient.updateUser({ name: user.name, image: user.image });
      setError(result.error?.message ?? "");
    } catch {
      setError("Could not update account. Try again later");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center py-4">
      <div className="md:w-1/3 w-full flex flex-col gap-4">
        <CardFrame>
          <CardFrameHeader>
            <CardFrameTitle>Welcome</CardFrameTitle>
            <CardFrameDescription>Your dashboard</CardFrameDescription>
            <CardFrameAction>
              <Button onClick={createRoom}>
                <PlusIcon />
                Create room
              </Button>
            </CardFrameAction>
          </CardFrameHeader>
          <Card>
            <CardPanel>
              <div className="flex justify-center">
                <div className="flex flex-col gap-4 w-full">
                  <Form className="flex w-full flex-col gap-8" onSubmit={submit}>
                    <Field name="image">
                      <div className="w-full flex gap-4 items-center">
                        <Avatar className="size-20">
                          <AvatarImage alt="User" src={user.image ?? ""} />
                          <AvatarFallback>
                            <UserIcon />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2 text-sm w-full">
                          <span className="text-base">Account</span>
                          <span className="text-muted-foreground">{maskedEmail}</span>
                          <div className="flex gap-2 text-nowrap">
                            {user.image ? (
                              <>
                                <span className="text-muted-foreground cursor-pointer" onClick={changePhoto}>
                                  Change photo
                                </span>
                                <span className="text-destructive-foreground cursor-pointer" onClick={deletePhoto}>
                                  Delete photo
                                </span>
                              </>
                            ) : (
                              <span className="text-foreground cursor-pointer">Add photo</span>
                            )}
                          </div>
                        </div>
                        <div className="w-full flex justify-end items-center"></div>
                      </div>
                    </Field>
                    <Field name="email" className="w-full">
                      <FieldLabel>Name</FieldLabel>
                      <Input value={user.name} placeholder="Enter your name" onChange={changeName} required />
                      <FieldError match="valueMissing">Please enter your name.</FieldError>
                    </Field>

                    {error ? <span className="text-sm text-destructive-foreground">{error}</span> : null}

                    <div className="flex justify-between items-center w-full">
                      <AlertDialog>
                        <AlertDialogTrigger render={<Button variant="ghost" type="button" />}>
                          Log Out
                        </AlertDialogTrigger>
                        <AlertDialogPopup>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogClose render={<Button variant="ghost" />}>Cancel</AlertDialogClose>
                            <AlertDialogClose render={<Button variant="destructive" onClick={logOut} />}>
                              Log out
                            </AlertDialogClose>
                          </AlertDialogFooter>
                        </AlertDialogPopup>
                      </AlertDialog>
                      <Button type="submit" loading={loading}>
                        Save
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </CardPanel>
          </Card>
        </CardFrame>
        <CardFrame>
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

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

function formatDuration(from: Date, to: Date) {
  const minutes = Math.max(1, Math.round((to.getTime() - from.getTime()) / 60000));
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

type RoomRowT = {
  room: {
    id: number;
    createdAt: Date;
    createdBy: number;
    egressUrl: string | null;
    finishedAt: Date | null;
    publicId: string;
    users: {
      id: number;
      name: string;
      image: string | null;
    }[];
  };
};

function RoomRow({ room }: RoomRowT) {
  const createdAt = new Date(room.createdAt);
  const finishedAt = room.finishedAt ? new Date(room.finishedAt) : null;
  const participans = room.users
    .filter((u) => u.id !== room.createdBy)
    .map((u) => u.name)
    .join(", ");
  const title = participans.length ? `Call with ${participans}` : "Call";

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
        {finishedAt ? <Badge variant="outline">Ended</Badge> : <Badge variant="success">Active</Badge>}
      </div>
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
    </div>
  );
}
