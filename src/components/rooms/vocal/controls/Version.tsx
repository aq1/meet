import { Badge } from "@/components/ui/badge";
import { APP_VERSION } from "@/lib/version";

export const Version = () => {
  return (
    <div className="hidden h-full items-center justify-center lg:flex">
      <Badge>{APP_VERSION}</Badge>
    </div>
  );
};
