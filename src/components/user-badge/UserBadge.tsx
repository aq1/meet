import { useUser } from "#/lib/user-store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const UserBadge = () => {
  const user = useUser();
  return (
    <Avatar className="size-12">
      <AvatarImage alt="User Avatar" src="" />
      <AvatarFallback>
        {user.username
          .split(" ")
          .map((w) => w[0])
          .join(" ")}
      </AvatarFallback>
    </Avatar>
  );
};
