import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { Field } from "#/components/ui/field";
import { Form } from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { getSession } from "#/lib/auth/session";

export const Route = createFileRoute("/_public/home")({
  loader: async () => {
    const session = await getSession();
    return { signedIn: Boolean(session) };
  },
  component: HomePage,
});

function HomePage() {
  const { signedIn } = Route.useLoaderData();
  const navigate = useNavigate();

  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const roomId = String(fd.get("roomId") ?? "").trim();
    if (roomId) {
      navigate({ to: "/room/$roomId", params: { roomId } });
    }
  };

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 p-6 text-center">
      <div className="grid gap-3">
        <h1 className="font-heading font-semibold text-4xl tracking-tight sm:text-5xl">
          Vocal Room
        </h1>
        <p className="max-w-md text-balance text-muted-foreground">
          Sing, play and rehearse together in real time.
        </p>
      </div>
      <div className="grid w-full max-w-xs gap-4">
        <Form className="grid gap-2" onSubmit={joinRoom}>
          <Field>
            <Input type="text" name="roomId" placeholder="Room ID" required />
          </Field>
          <Button type="submit" size="lg">
            Join room
          </Button>
        </Form>
        {signedIn ? (
          <Button size="lg" variant="outline" render={<Link to="/" />}>
            Go to rooms
          </Button>
        ) : (
          <Button size="lg" variant="outline" render={<Link to="/login" />}>
            Sign in
          </Button>
        )}
      </div>
    </main>
  );
}
