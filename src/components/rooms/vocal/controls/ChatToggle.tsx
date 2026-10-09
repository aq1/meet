import { MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";
import { useControls } from "./controls-state";

export const ChatToggle = () => {
  const showChat = useControls((state) => state.showChat);
  const toggle = useControls((state) => state.toggle);

  return (
    <Button
      onClick={() => toggle("showChat")}
      variant={showChat ? "default" : "outline"}
      size="icon-xl"
      title={showChat ? m.controls_hide_chat() : m.controls_show_chat()}
    >
      <MessageCircleIcon />
    </Button>
  );
};
