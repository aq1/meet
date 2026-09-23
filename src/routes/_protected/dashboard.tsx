import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "#/components/ui/button";
import { createRoomServerFn } from "#/lib/rooms/create-room-server-fn";
import { Card, CardPanel } from "@/components/ui/card";

export const Route = createFileRoute("/_protected/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const createRoomFn = useServerFn(createRoomServerFn);

  const createRoom = async () => {
    const { roomId } = await createRoomFn();
    navigate({ to: "/room/$roomId", params: { roomId } });
  };

  return (
    <div className="flex flex-col gap-4 items-center py-4">
      <Card className="w-full max-w-xs">
        <CardPanel>
          <div className="w-full flex justify-between items-center">
            <span className="font-semibold text-lg">Vocal Room</span>
            <Button onClick={createRoom}>Create</Button>
          </div>
        </CardPanel>
      </Card>
    </div>
  );
}
