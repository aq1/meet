import { Card } from "@/components/ui/card";
import { Dialog, DialogHeader, DialogPopup, DialogTitle } from "@/components/ui/dialog";
import { useIsTablet } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useControls } from "../rooms/vocal/controls/controls-state";

type SidePanelT = {
  title: string;
  children: React.ReactNode;
};

export const SidePanel = ({ title, children }: SidePanelT) => {
  const isTablet = useIsTablet();
  const setControls = useControls((state) => state.set);

  const showDialog = useControls((state) => isTablet && state.showChat);
  const showSidePanel = useControls((state) => !isTablet && state.showChat);

  const closePanel = () => setControls("showChat", false);

  return (
    <div className={cn(!(showDialog || showSidePanel) && "hidden")}>
      <Dialog open={showDialog} onOpenChange={closePanel}>
        <DialogPopup portalProps={{ keepMounted: true }} className="h-full min-h-48" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex min-h-40 p-6">
            <div className="min-h-0 flex-1">{children}</div>
          </div>
        </DialogPopup>
      </Dialog>
      <Card className={cn("flex size-full min-h-0 basis-1/4 justify-end gap-4 py-4", !showSidePanel && "hidden")}>
        <div className="flex size-full min-h-0 flex-col px-4">{children}</div>
      </Card>
    </div>
  );
};
