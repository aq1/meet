import { createFileRoute, useRouter } from "@tanstack/react-router";
import { getLkInfoFn } from "@/apps/hq/functions/get-lk-info";
import { DateTime } from "@/components/datetime/DateTime";
import { Duration } from "@/components/datetime/Duration";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useServerFn } from "@tanstack/react-start";
import { deleteRoomFn } from "@/apps/hq/functions/delete-room";

export const Route = createFileRoute("/hq/")({
  component: RouteComponent,
  loader: async () => {
    return await getLkInfoFn();
  },
});

const LiveKitRooms = () => {
  const { rooms } = Route.useLoaderData();
  const router = useRouter();
  const deleteRoomAction = useServerFn(deleteRoomFn);
  const deleteRoom = async (roomId: string) => {
    await deleteRoomAction({ data: { roomId } });
    router.invalidate();
  };

  return (
    <Table>
      <TableCaption>LiveKit Rooms</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Participants</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((r) => (
          <TableRow key={r.sid}>
            <TableCell>{r.name}</TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <span>
                  <Duration from={r.creationTime} />
                </span>
                <span className="text-xs text-muted-foreground">
                  <DateTime value={r.creationTime} />
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-2">
                {r.participants.map((p) => {
                  return (
                    <div key={p.identity} className="flex flex-col">
                      <div className="flex gap-1 text-xs text-muted-foreground">
                        <span className="capitalize">{p.state}</span>
                        <span className="capitalize">{p.kind}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-sm">{p.identity}</span>
                        <span>{p.name ? `: ${p.name}` : null}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TableCell>
            <TableCell>
              <AlertDialog>
                <AlertDialogTrigger render={<Button variant="outline" />}>Delete Room</AlertDialogTrigger>
                <AlertDialogPopup>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogClose render={<Button variant="ghost" />}>Cancel</AlertDialogClose>
                    <AlertDialogClose
                      render={<Button onClick={async () => await deleteRoom(r.name)} variant="destructive" />}
                    >
                      Delete Room
                    </AlertDialogClose>
                  </AlertDialogFooter>
                </AlertDialogPopup>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

function RouteComponent() {
  return (
    <div className="w-full flex flex-col gap-4">
      <LiveKitRooms />
    </div>
  );
}
