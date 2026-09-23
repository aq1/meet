import { createFileRoute, notFound } from "@tanstack/react-router";
import { VocalRoom } from "#/components/rooms/vocal/Room";
import { getRoom } from "#/lib/rooms";

export const Route = createFileRoute("/_public/room/$roomId")({
  loader: async ({ params }) => {
    const { exists } = await getRoom({ data: params.roomId });
    if (!exists) {
      throw notFound();
    }
  },
  notFoundComponent: () => (
    <div className="flex min-h-svh items-center justify-center p-6 text-center text-muted-foreground">
      Room not found
    </div>
  ),
  component: RoomPage,
});

function RoomPage() {
  const { roomId } = Route.useParams();
  return <VocalRoom roomId={roomId} />;
}
