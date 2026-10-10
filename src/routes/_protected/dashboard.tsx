import { createFileRoute, useNavigate, useRouteContext } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { DownloadIcon, PlusIcon, RouteIcon, UserIcon, VideoIcon } from "lucide-react";
import { type ChangeEvent, type SubmitEvent, useRef, useState } from "react";
import { presignAvatarUploadServerFn } from "@/apps/auth/functions/presign-avatar-upload";
import { createRoomServerFn } from "@/apps/rooms/functions/create-room";
import { listMyRoomsServerFn } from "@/apps/rooms/functions/list-my-rooms";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { toastManager } from "@/components/ui/toast";
import { authClient } from "@/lib/auth/client";
import { putWithProgress } from "@/lib/s3/put-with-progress";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/_protected/dashboard")({
  component: DashboardPage,
  loader: () => listMyRoomsServerFn(),
});

function DashboardPage() {
  const navigate = useNavigate();
  const createRoomFn = useServerFn(createRoomServerFn);
  const presignAvatarUpload = useServerFn(presignAvatarUploadServerFn);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const rooms = Route.useLoaderData();
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

  const changePhoto = () => {
    photoInputRef.current?.click();
  };

  const uploadPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const { url, publicUrl } = await presignAvatarUpload({ data: { type: file.type, size: file.size } });
      await putWithProgress(url, file, () => {});
      setUser((p) => {
        return { ...p, image: publicUrl };
      });
    } catch {
      setError(m.dashboard_photo_upload_error());
    }
    setLoading(false);
  };

  const changeName = (e: ChangeEvent<HTMLInputElement>) => {
    setUser((p) => {
      return { ...p, name: e.target.value };
    });
  };

  const logOut = async () => {
    await authClient.signOut();
    await navigate({ to: "/" });
  };

  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await authClient.updateUser({ name: user.name, image: user.image });
      setError(result.error?.message ?? "");
      if (!result.error) {
        toastManager.add({
          id: "profile-save",
          title: "Profile Saved",
        });
      }
    } catch {
      setError(m.dashboard_update_error());
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center py-4">
      <div className="md:w-1/3 w-full flex flex-col gap-4">
        <CardFrame>
          <CardFrameHeader>
            <CardFrameTitle>{m.dashboard_welcome()}</CardFrameTitle>
            <CardFrameDescription>{m.dashboard_description()}</CardFrameDescription>
            <CardFrameAction>
              <Button onClick={createRoom}>
                <PlusIcon />
                {m.create_room()}
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
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={uploadPhoto}
                        />
                        <Avatar className="size-20">
                          <AvatarImage alt={m.dashboard_avatar_alt()} src={user.image ?? ""} />
                          <AvatarFallback>
                            <UserIcon />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2 text-sm w-full">
                          <span className="text-base">{m.dashboard_account()}</span>
                          <span className="text-muted-foreground">{maskedEmail}</span>
                          <div className="flex gap-2 text-nowrap">
                            {user.image ? (
                              <>
                                <button
                                  type="button"
                                  className="text-muted-foreground cursor-pointer"
                                  onClick={changePhoto}
                                >
                                  {m.dashboard_change_photo()}
                                </button>
                                <button
                                  type="button"
                                  className="text-destructive-foreground cursor-pointer"
                                  onClick={deletePhoto}
                                >
                                  {m.dashboard_delete_photo()}
                                </button>
                              </>
                            ) : (
                              <button type="button" className="text-foreground cursor-pointer" onClick={changePhoto}>
                                {m.dashboard_add_photo()}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="w-full flex justify-end items-center"></div>
                      </div>
                    </Field>
                    <Field name="email" className="w-full">
                      <FieldLabel>{m.dashboard_name_label()}</FieldLabel>
                      <Input
                        value={user.name}
                        placeholder={m.dashboard_name_placeholder()}
                        onChange={changeName}
                        required
                      />
                      <FieldError match="valueMissing">{m.dashboard_name_required()}</FieldError>
                    </Field>

                    {error ? <span className="text-sm text-destructive-foreground">{error}</span> : null}

                    <div className="flex justify-between items-center w-full">
                      <AlertDialog>
                        <AlertDialogTrigger render={<Button variant="ghost" type="button" />}>
                          {m.dashboard_log_out()}
                        </AlertDialogTrigger>
                        <AlertDialogPopup>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{m.dashboard_log_out_confirm()}</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogClose render={<Button variant="ghost" />}>{m.cancel()}</AlertDialogClose>
                            <AlertDialogClose render={<Button variant="destructive" onClick={logOut} />}>
                              {m.dashboard_log_out()}
                            </AlertDialogClose>
                          </AlertDialogFooter>
                        </AlertDialogPopup>
                      </AlertDialog>
                      <Button type="submit" loading={loading}>
                        {m.dashboard_save()}
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
            <CardFrameTitle>{m.dashboard_history_title()}</CardFrameTitle>
            <CardFrameDescription>{m.dashboard_history_description()}</CardFrameDescription>
          </CardFrameHeader>
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
                      <RoomRow room={r} viewerId={Number(user.id)} />
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
  if (minutes < 60) return m.dashboard_duration_minutes({ minutes });
  return m.dashboard_duration_hours({ hours: Math.floor(minutes / 60), minutes: minutes % 60 });
}

type RoomRowT = {
  viewerId: number;
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
