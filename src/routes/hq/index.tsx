import { createFileRoute } from "@tanstack/react-router";
import { getLkInfoFn } from "@/apps/admin/functions/get-lk-info";
import { DateTime } from "@/components/datetime/DateTime";
import { Duration } from "@/components/datetime/Duration";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/hq/")({
  component: RouteComponent,
  loader: async () => {
    return await getLkInfoFn();
  },
});

const LiveKitRooms = () => {
  const { rooms } = Route.useLoaderData();

  return (
    <Table>
      <TableCaption>LiveKit Rooms</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Participants</TableHead>
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
