import { Badge } from "#/components/ui/badge";

export const Version = () => {
  return (
    <div className="mr-auto hidden h-full items-center justify-center lg:flex">
      <Badge>{__APP_VERSION__}</Badge>
    </div>
  );
};
