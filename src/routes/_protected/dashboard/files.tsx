import { createFileRoute, useRouter } from "@tanstack/react-router";
import { listFilesFn } from "@/apps/storage/functions/list-files";
import { FilesPanel } from "@/components/files/FilesPanel";
import { Card, CardPanel } from "@/components/ui/card";

export const Route = createFileRoute("/_protected/dashboard/files")({
  loader: () => listFilesFn(),
  component: FilesPage,
});

function FilesPage() {
  const files = Route.useLoaderData();
  const router = useRouter();

  return (
    <Card className="max-h-[70dvh]">
      <CardPanel className="flex min-h-0 flex-1 flex-col">
        <FilesPanel files={files} onFilesChange={() => router.invalidate()} />
      </CardPanel>
    </Card>
  );
}
