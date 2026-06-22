import { useRoomContext } from "@livekit/components-react";
import { useNavigate } from "@tanstack/react-router";
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
import { useIsTablet } from "#/hooks/use-media-query";

export const LeaveButton = () => {
  const isTablet = useIsTablet();
  const room = useRoomContext();
  const navigate = useNavigate();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="destructive-outline"
            size={isTablet ? "icon-xl" : "xl"}
            title="Leave"
          >
            <PhoneOff />
            <span className="hidden lg:inline">Leave</span>
          </Button>
        }>
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
            onClick={async () => {
              await room.disconnect();
              navigate({ to: "/" });
            }}
          >
            Leave
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog >
  );
};
