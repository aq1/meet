import { XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogPopup } from "#/components/ui/dialog";
import { useIsTablet } from "#/hooks/use-media-query";
import { cn } from "#/lib/utils";
import { useControls } from "../rooms/vocal/controls/controls-state";
import { Button } from "../ui/button";

type SidePanelT = {
  children: React.ReactNode;
};

export const SidePanel = ({ children }: SidePanelT) => {
  const isTablet = useIsTablet();
  const showPanel = useControls((state) => state.showChat);
  const setControls = useControls((state) => state.set);

  const closePanel = () => setControls("showChat", false);

  return (
    <>
      <Dialog open={isTablet && showPanel} onOpenChange={closePanel}>
        <DialogPopup portalProps={{ keepMounted: true }} className="h-full" showCloseButton={false}>
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-6">
            <div className="flex items-center justify-between">
              <DialogClose aria-label="Close" render={<Button size="icon" variant="ghost" title="Close" />}>
                <XIcon />
              </DialogClose>
            </div>
            <div className="min-h-0 flex-1">{children}</div>
          </div>
        </DialogPopup>
      </Dialog>
      <div className={cn("flex min-h-0 basis-1/4 justify-end gap-4", !showPanel && "hidden")}>
        <div className="flex size-full min-h-0 flex-col px-4">{children}</div>
      </div>
    </>
  );
};
