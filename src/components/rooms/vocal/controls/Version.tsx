import { Badge } from "@/components/ui/badge";

export const Version = () => {
  return (
    <div className="hidden h-full items-center justify-center lg:flex">
      <Badge>{__APP_VERSION__}</Badge>
    </div>
  );
};
