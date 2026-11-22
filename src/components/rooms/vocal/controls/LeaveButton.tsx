import { useRoomContext } from "@livekit/components-react";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { PhoneOff } from "lucide-react";
import { endRoomServerFn } from "@/apps/rooms/functions/end-room";
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
import { useRoomStore } from "../room-state";

export const LeaveButton = () => {
  const { user } = useRouteContext({ from: "__root__" });
  const isTablet = useIsTablet();
  const room = useRoomContext();
  const navigate = useNavigate();
  const isOwner = useRoomStore((s) => s.isOwner);
  const endRoom = useServerFn(endRoomServerFn);

  const ownerText = {
    button: m.controls_leave_owner(),
    title: m.controls_leave_title_owner(),
    description: m.controls_leave_description_owner(),
  };

  const defaultText = {
    button: m.controls_leave(),
    title: m.controls_leave_title(),
    description: m.controls_leave_description(),
  };

  const text = isOwner ? ownerText : defaultText;

  const disconnect = async () => {
    try {
      if (isOwner) {
        await endRoom({ data: { roomId: room.name } });
      } else {
        await room.disconnect();
      }
    } catch {}
    navigate({ to: user && !user.isAnonymous ? "/dashboard" : "/" });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive-outline" size={isTablet ? "icon-xl" : "xl"} title={text.button}>
            <PhoneOff />
            <span className="hidden lg:inline">{text.button}</span>
          </Button>
        }
      ></AlertDialogTrigger>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>{text.title}</AlertDialogTitle>
          <AlertDialogDescription>{text.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="outline">{m.cancel()}</Button>} />
          <AlertDialogClose render={<Button variant="destructive" />} onClick={disconnect}>
            {text.button}
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
};
