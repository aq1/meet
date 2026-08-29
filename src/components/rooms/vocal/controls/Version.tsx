import { Badge } from "#/components/ui/badge";

export const Version = () => {
  return (
    <div className="hidden lg:flex h-full justify-center items-center mr-auto">
      <Badge>{import.meta.env.VITE_VERSION}</Badge>
    </div>
  );
};
