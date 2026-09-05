import { Badge } from "#/components/ui/badge";

export const Version = () => {
  return (
    <div className="hidden lg:flex h-full justify-center items-center mr-auto">
      <Badge>{__APP_VERSION__}</Badge>
    </div>
  );
};
