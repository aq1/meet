import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
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
      {signedIn ? (
        <Button size="xl" render={<Link to="/" />}>
          Go to rooms
        </Button>
      ) : (
        <Button size="xl" render={<Link to="/login" />}>
          Sign in
        </Button>
      )}
    </main>
  );
}
