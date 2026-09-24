import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AudioLinesIcon, PianoIcon, PlusIcon, UsersIcon, VideoIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { getSession } from "#/lib/auth/get-session";
import { createRoomServerFn } from "#/lib/rooms/create-room-server-fn";

export const Route = createFileRoute("/_public/")({
  loader: async () => {
    const session = await getSession();
    return { user: session?.user ?? null };
  },
  component: IndexPage,
});

const FEATURES = [
  { icon: VideoIcon, title: "Video & audio", text: "Low-latency calls tuned for voice." },
  { icon: PianoIcon, title: "Shared piano", text: "Play notes everyone in the room hears." },
  { icon: UsersIcon, title: "Invite by link", text: "Share the room URL and you're set." },
];

function IndexPage() {
  const { user } = Route.useLoaderData();

  return (
    <div className="flex min-h-svh flex-col">
      <Toolbar loggedIn={Boolean(user)} />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,--theme(--color-primary/12%),transparent_60%)]" />
        <div className="flex max-w-xl flex-col items-center gap-4 text-center">
          <h1 className="font-heading font-semibold text-4xl tracking-tight sm:text-5xl">Practice together, live.</h1>
          <p className="text-lg text-muted-foreground">
            Vocal Room is a simple space for lessons and rehearsals — video, audio and a shared piano in one place.
          </p>
        </div>
        <div className="mt-14 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl border bg-card/60 p-4">
              <Icon className="mb-3 size-5 text-muted-foreground" />
              <div className="font-medium">{title}</div>
              <div className="text-muted-foreground text-sm">{text}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function Toolbar({ loggedIn }: { loggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <AudioLinesIcon className="size-5 text-primary" />
          Vocal Room
        </Link>
        {loggedIn ? <CreateRoomButton /> : <Button render={<Link to="/login" />}>Log in</Button>}
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
      Create room
    </Button>
  );
}
