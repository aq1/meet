import { useRoomContext } from "@livekit/components-react";
import { PhoneOff } from "lucide-react";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import { useIsMobile } from "#/hooks/use-media-query";

export const LeaveButton = () => {
  const isMobile = useIsMobile();
  const room = useRoomContext();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="destructive-outline"
            size={isMobile ? "icon-xl" : "xl"}
            title="Leave"
          />
        }
      >
        <PhoneOff />
        {isMobile ? null : <span>Leave</span>}
      </AlertDialogTrigger>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave the room?</AlertDialogTitle>
          <AlertDialogDescription>
            You'll be disconnected from this room. You can rejoin at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <AlertDialogClose
            render={<Button variant="destructive" />}
            onClick={() => room.disconnect()}
          >
            Leave
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
};
