import type { UserStore } from "#/lib/user-store";
import { User } from "lucide-react";
import { Card } from "../ui/card";

export const ParticipantVideoTile = ({ user }: { user?: UserStore }) => {
  return (
    <div className="size-full flex flex-col justify-center items-center">
      <Card className="flex flex-col gap-1 p-4 items-center">
        <User size={128} />
        {user?.username}
      </Card>
    </div>
  );
};
