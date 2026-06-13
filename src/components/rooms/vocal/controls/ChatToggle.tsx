import { MessageCircleIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { useControls } from "../controls-state";

export const ChatToggle = () => {
  const showChat = useControls((state) => state.showChat);
  const toggle = useControls((state) => state.toggle);

  return (
    <Button
      onClick={() => toggle("showChat")}
      variant={showChat ? "default" : "outline"}
      size="icon-xl"
      title={showChat ? "Hide chat" : "Show chat"}
    >
      <MessageCircleIcon />
    </Button>
  );
};
