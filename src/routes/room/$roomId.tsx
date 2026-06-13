import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LoginDialog } from "#/components/login-dialog/LoginDialog";
import { VocalRoom } from "#/components/rooms/vocal/Room";
import { useUser } from "#/lib/user-store";

export const Route = createFileRoute("/room/$roomId")({
  component: RoomPage,
});

function RoomPage() {
  const { roomId } = Route.useParams();
  const username = useUser((state) => state.username);
  const [showLoginDialog, setShowLoginDialog] = useState(true);

  useEffect(() => {
    setShowLoginDialog(!username);
  }, [username]);

  if (showLoginDialog) {
    return <LoginDialog />;
  }

  return <VocalRoom roomId={roomId} />;
}
