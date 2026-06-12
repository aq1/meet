import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LoginDialog } from "#/components/login-dialog/LoginDialog";
import { VocalRoom } from "#/components/rooms/vocal/Room";
import { useUser } from "#/lib/user-store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [start, setStart] = useState(false);
  const username = useUser((state) => state.username);

  if (start) {
    return <VocalRoom />;
  }
  return <LoginDialog onSubmit={() => setStart(!!username)} />;
}
