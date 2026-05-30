import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { ScrollArea } from "#/components/ui/scroll-area";
import { Textarea } from "#/components/ui/textarea";
import { useControls } from "./controls-state";
import { useLivekit, type ChatMessage, type Message } from "./room-state";
import { useEffect, useState } from "react";
import { RoomEvent } from "livekit-client";
import { SendIcon } from "lucide-react";

const decoder = new TextDecoder();

type ChatMessageWithInitiator = ChatMessage & { initiator: "local" | "remote" };

const ChatMessage = ({ message }: { message: ChatMessageWithInitiator }) => {
  return (
    <div className="flex flex-col">
      {message.initiator === "local" ? (
        <span className="text-indigo-400">Local</span>
      ) : (
        <span className="text-pink-400">Remote</span>
      )}
      <span>{message.text}</span>
    </div>
  );
};

export const Panel = () => {
  const controls = useControls();
  const livekit = useLivekit();
  const [chat, setChat] = useState<Array<ChatMessageWithInitiator>>([]);
  const [text, setText] = useState("");

  const addMessage = (msg: Message, initiator: "local" | "remote") => {
    if (msg.type !== "chat") {
      return;
    }
    setChat((prev) => [...prev, { initiator, ...msg }]);
  };

  const send = () => {
    addMessage({ text, type: "chat" }, "local");
    livekit.sendChat(text);
    setText("");
  };

  useEffect(() => {
    if (!livekit.room) {
      return;
    }

    const chatListener = (payload: Uint8Array) => {
      const msg: Message = JSON.parse(decoder.decode(payload));
      addMessage(msg, "remote");
    };

    livekit.room.on(RoomEvent.DataReceived, chatListener);
    return () => {
      livekit.room.off(RoomEvent.DataReceived, chatListener);
    };
  }, [livekit.room]);

  if (!controls.showChat) {
    return null;
  }
  return (
    <div className="absolute right-0 h-full w-[24%] min-w-80 z-10">
      <Card className="h-dvh p-4">
        <div className="flex flex-col gap-2 justify-between min-h-full">
          <ScrollArea className="flex-1 min-h-0">
            <div className="flex flex-col grow gap-4">
              {chat.map((msg) => {
                return <ChatMessage message={msg} />;
              })}
            </div>
          </ScrollArea>
          <div className="flex gap-3 items-end">
            <div className="flex w-full">
              <Textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
                className="w-full"
                name="chat"
                placeholder="..."
              />
            </div>
            <Button onClick={send} size="icon" disabled={!text.length}>
              <SendIcon />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
