import type { UserStore } from "#/lib/user-store";
import { User } from "lucide-react";
import { Card } from "../ui/card";
import { Track, type RemoteTrack } from "livekit-client";
import { useEffect, useRef } from "react";

export const ParticipantVideoTile = ({
  user,
  track,
}: {
  user?: UserStore;
  track?: RemoteTrack;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!track) {
      return;
    }

    if (track.kind === Track.Kind.Video && trackRef.current) {
      const el = track.attach();
      trackRef.current.appendChild(el);
    }
  }, [track, trackRef]);

  return (
    <div className="size-full flex flex-col justify-center items-center">
      <Card className="flex flex-col gap-1 p-4 items-center">
        <div ref={trackRef} className={track ? "size-full" : "hidden"} />
        {track ? null : <User size={128} />}
        {user?.username}
      </Card>
    </div>
  );
};
