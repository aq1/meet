import { PianoIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { useControls } from "../controls-state";

export const PianoControl = () => {
  const showKeyboard = useControls((state) => state.showKeyboard);
  const toggle = useControls((state) => state.toggle);

  return (
    <Button
      onClick={() => toggle("showKeyboard")}
      variant={showKeyboard ? "default" : "outline"}
      size="icon-xl"
      title={showKeyboard ? "Hide piano" : "Show piano"}
    >
      <PianoIcon />
    </Button>
  );
};
