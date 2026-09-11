import { createFileRoute } from "@tanstack/react-router";
import { VocalRoom } from "#/components/rooms/vocal/Room";

export const Route = createFileRoute("/_private/room/$roomId")({
  component: RoomPage,
});

function RoomPage() {
  const { roomId } = Route.useParams();
  return <VocalRoom roomId={roomId} />;
}
