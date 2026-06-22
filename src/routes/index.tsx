import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "#/components/ui/card";
import { Field } from "#/components/ui/field";
import { Form } from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { useUser } from "#/lib/user-store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <Welcome />;
}

function Welcome() {
  const navigate = useNavigate();
  const username = useUser((state) => state.username);

  const createRoom = () => {
    const roomId = Math.random().toString(36).slice(2, 10);
    navigate({ to: "/room/$roomId", params: { roomId } });
  };

  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const roomId = String(fd.get("roomId") ?? "").trim();
    if (roomId) {
      navigate({ to: "/room/$roomId", params: { roomId } });
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome{username ? `, ${username}` : ""}</CardTitle>
          <CardDescription>
            Create a new room or join an existing one.
          </CardDescription>
        </CardHeader>
        <CardPanel className="grid gap-6">
          <Button onClick={createRoom}>Create room</Button>
          <Form className="grid gap-2" onSubmit={joinRoom}>
            <Field>
              <Input type="text" name="roomId" placeholder="Room ID" required />
            </Field>
            <Button type="submit" variant="outline">
              Join room
            </Button>
          </Form>
        </CardPanel>
      </Card>
    </div>
  );
}
