import { useRoomContext } from "@livekit/components-react";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { DisconnectReason, RoomEvent } from "livekit-client";
import { useCallback, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";
import { useRoomStore } from "./room-state";

export default function RoomDeletedAlert() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const room = useRoomContext();

  const { user } = useRouteContext({ from: "__root__" });
  const isOwner = useRoomStore((s) => s.isOwner);

  const leaveRoom = () => {
    navigate({ to: user && !user.isAnonymous ? "/dashboard" : "/" });
  };

  const onDisconnect = useCallback(
    (reason?: DisconnectReason) => {
      if (isOwner) {
        return;
      }
      if (reason === DisconnectReason.ROOM_DELETED) {
        setIsOpen(true);
      }
    },
    [isOwner],
  );

  useEffect(() => {
    room.on(RoomEvent.Disconnected, onDisconnect);
    return () => {
      room.off(RoomEvent.Disconnected, onDisconnect);
    };
  }, [room, onDisconnect]);

  return (
    <AlertDialog open={isOpen} onOpenChange={leaveRoom}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>{m.room_deleted_title()}</AlertDialogTitle>
          <AlertDialogDescription>{m.room_deleted_description()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button />}>{m.room_deleted_ok()}</AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
