import { RoomContext } from "@livekit/components-react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Room } from "livekit-client";
import { useEffect, useState } from "react";
import { useControls } from "#/components/rooms/vocal/controls/controls-state";
import { VocalRoom } from "#/components/rooms/vocal/Room";
import { RoomLobby } from "#/components/rooms/vocal/RoomLobby";
import { grantRoomTokenServerFn } from "#/lib/rooms/functions/grant-room-token.function";
import { useUser } from "#/lib/user-store";

export const Route = createFileRoute("/_public/room/$roomId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { roomId } = Route.useParams();

  const username = useUser((state) => state.username);
  const [joined, setJoined] = useState(false);
  const grant = useServerFn(grantRoomTokenServerFn);
  const cameraEnabled = useControls((s) => s.cameraEnabled);
  const micEnabled = useControls((s) => s.micEnabled);
  const cameraDeviceId = useControls((s) => s.cameraDeviceId);
  const micDeviceId = useControls((s) => s.micDeviceId);
  const speakerDeviceId = useControls((s) => s.speakerDeviceId);

  const [room] = useState(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
        disconnectOnPageLeave: false,
        publishDefaults: {
          videoCodec: "vp8",
        },
      }),
  );

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    const handlePageHide = () => {
      room.disconnect();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [room]);

  const join = async () => {
    if (!room || !username) {
      return;
    }
    room.startAudio();
    const { wss, token } = await grant({
      data: { username, roomId },
    });
    await room.connect(wss, token);

    try {
      if (micEnabled) {
        await room.localParticipant.setMicrophoneEnabled(true, {
          deviceId: micDeviceId || undefined,
        });
      }
      if (cameraEnabled) {
        await room.localParticipant.setCameraEnabled(true, {
          deviceId: cameraDeviceId || undefined,
        });
      }
      if (speakerDeviceId) {
        await room.switchActiveDevice("audiooutput", speakerDeviceId);
      }
    } catch {}
    setJoined(true);
  };

  return (
    <RoomContext.Provider value={room}>{joined ? <VocalRoom /> : <RoomLobby onJoin={join} />}</RoomContext.Provider>
  );
}
