import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AudioLinesIcon, PianoIcon, PlusIcon, UsersIcon, VideoIcon } from "lucide-react";
import { useState } from "react";
import { getSession } from "@/apps/auth/functions/get-session";
import { createRoomServerFn } from "@/apps/rooms/functions/create-room";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/_public/")({
  loader: async () => {
    const session = await getSession();
    return { user: session?.user ?? null };
  },
  component: IndexPage,
});

const FEATURES = [
  { icon: VideoIcon, title: m.home_feature_video_title, text: m.home_feature_video_text },
  { icon: PianoIcon, title: m.home_feature_piano_title, text: m.home_feature_piano_text },
  { icon: UsersIcon, title: m.home_feature_invite_title, text: m.home_feature_invite_text },
];

function IndexPage() {
  const { user } = Route.useLoaderData();

  return (
    <div className="flex min-h-svh flex-col">
      <Toolbar loggedIn={Boolean(user && !user.isAnonymous)} />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,--theme(--color-primary/12%),transparent_60%)]" />
        <div className="flex max-w-xl flex-col items-center gap-4 text-center">
          <h1 className="font-heading font-semibold text-4xl tracking-tight sm:text-5xl">{m.home_title()}</h1>
          <p className="text-lg text-muted-foreground">{m.home_subtitle()}</p>
        </div>
        <div className="mt-14 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title()} className="rounded-xl border bg-card/60 p-4">
              <Icon className="mb-3 size-5 text-muted-foreground" />
              <div className="font-medium">{title()}</div>
              <div className="text-muted-foreground text-sm">{text()}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function ToolbarButtons() {
  return (
    <div className="flex gap-2">
      <Button render={<Link to="/dashboard" />} variant="outline">
        {m.home_profile()}
      </Button>
      <CreateRoomButton />
    </div>
  );
}

function Toolbar({ loggedIn }: { loggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <AudioLinesIcon className="size-5 text-primary" />
          {m.app_name()}
        </Link>
        {loggedIn ? <ToolbarButtons /> : <Button render={<Link to="/login" />}>{m.home_log_in()}</Button>}
      </div>
    </header>
  );
}

function CreateRoomButton() {
  const navigate = useNavigate();
  const createRoomFn = useServerFn(createRoomServerFn);
  const [pending, setPending] = useState(false);

  const createRoom = async () => {
    setPending(true);
    try {
      const { roomId } = await createRoomFn();
      await navigate({ to: "/room/$roomId", params: { roomId } });
    } finally {
      setPending(false);
    }
  };

  return (
    <Button onClick={createRoom} loading={pending}>
      <PlusIcon />
      {m.create_room()}
    </Button>
  );
}
