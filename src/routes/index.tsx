import { createFileRoute } from "@tanstack/react-router";
import { LoginDialog } from "#/components/login-dialog/LoginDialog";
import { VocalRoom } from "#/components/rooms/vocal/Room";
import { useUser } from "#/lib/user-store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const user = useUser();
  if (user.username) {
    return <VocalRoom />;
  }
  return <LoginDialog />;
}
