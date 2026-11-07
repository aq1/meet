import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { deleteRoomFn } from "@/apps/hq/functions/delete-room";
import { getFullHqInfo } from "@/apps/hq/functions/get-full-hq-info";
import { DateTime } from "@/components/datetime/DateTime";
import { Duration } from "@/components/datetime/Duration";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/hq/")({
  component: RouteComponent,
  loader: async () => {
    return await getFullHqInfo();
  },
});

const LiveKitRoomsTable = () => {
  const { lkRooms } = Route.useLoaderData();
  const router = useRouter();
  const deleteRoomAction = useServerFn(deleteRoomFn);
  const deleteRoom = async (roomId: string) => {
    await deleteRoomAction({ data: { roomId } });
    router.invalidate();
  };

  if (lkRooms.length === 0) {
    return (
      <div className="flex py-4 justify-center text-lg text-muted-foreground">
        <span>No active LiveKit rooms</span>
      </div>
    );
  }

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
        {lkRooms.map((r) => (
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

const UsersTable = () => {
  const { users } = Route.useLoaderData();

  if (users.length === 0) {
    return (
      <div className="flex py-4 justify-center text-lg text-muted-foreground">
        <span>No users found</span>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Users</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.id}</TableCell>
            <TableCell>{r.email}</TableCell>
            <TableCell>{r.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const RoomsTable = () => {
  const { rooms } = Route.useLoaderData();

  if (rooms.length === 0) {
    return (
      <div className="flex py-4 justify-center text-lg text-muted-foreground">
        <span>No rooms found</span>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Rooms</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Public ID</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Started At</TableHead>
          <TableHead>Finished At</TableHead>
          <TableHead>Participants</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.id}</TableCell>
            <TableCell>{r.publicId}</TableCell>
            <TableCell>{r.creator.name}</TableCell>
            <TableCell>
              <DateTime value={r.startedAt} />
            </TableCell>
            <TableCell>
              <DateTime value={r.finishedAt} />
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1 text-sm">
                {r.roomUsers.map((rU) => {
                  return (
                    <p key={rU.id}>
                      <span className="text-muted-foreground">{rU.user.id}: </span>
                      <span>{rU.user.name}</span>
                    </p>
                  );
                })}
              </div>
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
      <LiveKitRoomsTable />
      <RoomsTable />
      <UsersTable />
    </div>
  );
}
