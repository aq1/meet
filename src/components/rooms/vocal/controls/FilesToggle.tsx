import { FileMusicIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { useControls } from "./controls-state";

export const FilesToggle = () => {
  const showFiles = useControls((state) => state.showFiles);
  const toggle = useControls((state) => state.toggle);

  return (
    <Button
      onClick={() => toggle("showFiles")}
      variant={showFiles ? "default" : "outline"}
      size="icon-xl"
      title={showFiles ? "Hide files" : "Show files"}
    >
      <FileMusicIcon />
    </Button>
  );
};
