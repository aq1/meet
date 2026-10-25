import { FolderIcon } from "lucide-react";
import { Card, CardPanel } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { m } from "@/paraglide/messages";

export function FilesPanel() {
  return (
    <Card>
      <CardPanel>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderIcon />
            </EmptyMedia>
            <EmptyTitle>{m.dashboard_no_files_title()}</EmptyTitle>
            <EmptyDescription>{m.dashboard_no_files_description()}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardPanel>
    </Card>
  );
}
