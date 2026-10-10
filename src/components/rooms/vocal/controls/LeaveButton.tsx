import { useRoomContext } from "@livekit/components-react";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useIsTablet } from "@/hooks/use-media-query";
import { m } from "@/paraglide/messages";

export const LeaveButton = () => {
  const isTablet = useIsTablet();
  const room = useRoomContext();
  const navigate = useNavigate();

  const { user } = useRouteContext({ from: "__root__" });
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive-outline" size={isTablet ? "icon-xl" : "xl"} title={m.controls_leave()}>
            <PhoneOff />
            <span className="hidden lg:inline">{m.controls_leave()}</span>
          </Button>
        }
      ></AlertDialogTrigger>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>{m.controls_leave_title()}</AlertDialogTitle>
          <AlertDialogDescription>{m.controls_leave_description()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="outline">{m.cancel()}</Button>} />
          <AlertDialogClose
            render={<Button variant="destructive" />}
            onClick={async () => {
              await room.disconnect();
              navigate({ to: user && !user.isAnonymous ? "/dashboard" : "/" });
            }}
          >
            {m.controls_leave()}
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
};
