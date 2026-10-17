import { XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogPopup } from "@/components/ui/dialog";
import { useIsTablet } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { useControls } from "../rooms/vocal/controls/controls-state";
import { Button } from "../ui/button";

type SidePanelT = {
  children: React.ReactNode;
};

export const SidePanel = ({ children }: SidePanelT) => {
  const isTablet = useIsTablet();
  const setControls = useControls((state) => state.set);

  const showDialog = useControls((state) => isTablet && state.showChat);
  const showSidePanel = useControls((state) => !isTablet && state.showChat);

  const closePanel = () => setControls("showChat", false);

  return (
    <div className={cn(!(showDialog || showSidePanel) && "hidden")}>
      <Dialog open={showDialog} onOpenChange={closePanel}>
        <DialogPopup portalProps={{ keepMounted: true }} className="h-full min-h-48" showCloseButton={false}>
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-6">
            <div className="flex items-center justify-between">
              <DialogClose aria-label={m.close()} render={<Button size="icon" variant="ghost" title={m.close()} />}>
                <XIcon />
              </DialogClose>
            </div>
            <div className="min-h-0 flex-1">{children}</div>
          </div>
        </DialogPopup>
      </Dialog>
      <div className={cn("flex size-full min-h-0 basis-1/4 justify-end gap-4", !showSidePanel && "hidden")}>
        <div className="flex size-full min-h-0 flex-col px-4">{children}</div>
      </div>
    </div>
  );
};
