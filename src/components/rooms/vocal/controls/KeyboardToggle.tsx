import { PianoIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { useControls } from "../controls-state";

export const KeyboardToggle = () => {
  const showKeyboard = useControls((state) => state.showKeyboard);
  const toggle = useControls((state) => state.toggle);

  return (
    <Button
      onClick={() => toggle("showKeyboard")}
      variant={showKeyboard ? "default" : "outline"}
      size="icon-xl"
      title={showKeyboard ? "Hide keyboard" : "Show keyboard"}
    >
      <PianoIcon />
    </Button>
  );
};
