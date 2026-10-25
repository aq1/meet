import type { ReceivedDataMessage } from "@livekit/components-core";

import { useDataChannel, useRoomContext } from "@livekit/components-react";
import { useRouteContext } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpIcon, Paperclip } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getChatMessagesFn } from "@/apps/rooms/functions/get-chat-messages";
import { postChatMessageFn } from "@/apps/rooms/functions/post-chat-message";
import { ChatMessageSchema } from "@/apps/rooms/shared/schemas";
import { listFilesFn } from "@/apps/storage/functions/list-files";
import { FilesPanel } from "@/components/files/FilesPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerSubmit,
  type ComposerValue,
  getComposerText,
} from "@/components/ui/composer";
import { Dialog, DialogHeader, DialogPopup, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toastManager } from "@/components/ui/toast";
import { useIsTablet } from "@/hooks/use-media-query";
import { m } from "@/paraglide/messages";
import { useControls } from "../controls/controls-state";
import { AudioSyncBridge } from "./AudioSyncBridge";
import { useChatState } from "./chat-state";
import { Message } from "./Message";

type AttachFileDialogT = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (fileId: number) => unknown;
};

const AttachFileDialog = ({ open, onOpenChange, onSelect }: AttachFileDialogT) => {
  const listFiles = useServerFn(listFilesFn);
  const [files, setFiles] = useState<Awaited<ReturnType<typeof listFilesFn>>>([]);

  const refresh = useCallback(
    () =>
      listFiles()
        .then(setFiles)
        .catch(() => {
          toastManager.add({ type: "error", id: "files-load-error", title: m.files_load_error() });
        }),
    [listFiles],
  );

  useEffect(() => {
    if (open) {
      refresh();
    }
  }, [open, refresh]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-h-[80dvh]">
        <DialogHeader>
          <DialogTitle>{m.chat_attach_file()}</DialogTitle>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col p-6 pt-1">
          <FilesPanel files={files} onFilesChange={refresh} onSelect={onSelect} />
        </div>
      </DialogPopup>
    </Dialog>
  );
};

const ChatInput = () => {
  const room = useRoomContext();
  const { user } = useRouteContext({ from: "__root__" });
  const canAttach = Boolean(user && !user.isAnonymous);
  const send = useServerFn(postChatMessageFn);
  const [attachOpen, setAttachOpen] = useState(false);

  const sendFile = async (fileId: number) => {
    try {
      await send({ data: { roomId: room.name, kind: "audio", payload: { id: fileId } } });
      setAttachOpen(false);
    } catch {
      toastManager.add({ type: "error", id: "chat-attach-file-error", title: m.chat_attach_file_error() });
    }
  };

  const [value, setValue] = useState<ComposerValue>([]);

  const sendDraft = async () => {
    if (!value.length) {
      return;
    }
    await send({ data: { roomId: room.name, kind: "text", payload: { text: getComposerText(value) } } });

    setValue([]);
  };

  return (
    <div className="flex items-center gap-2">
      {canAttach ? <AttachFileDialog open={attachOpen} onOpenChange={setAttachOpen} onSelect={sendFile} /> : null}
      <Composer
        className="w-full min-w-80"
        layout="adaptive"
        value={value}
        onValueChange={setValue}
        onSubmit={sendDraft}
      >
        <ComposerInput aria-label={m.chat_label()} placeholder={m.chat_placeholder()} />
        <ComposerActions>
          {canAttach ? (
            <ComposerActionGroup>
              <Button variant="outline" onClick={() => setAttachOpen(true)} title={m.chat_attach_file()}>
                <Paperclip />
              </Button>
            </ComposerActionGroup>
          ) : null}
          <ComposerActionGroup align="end">
            <ComposerSubmit
              render={
                <Button aria-label={m.chat_send_message()} size="icon">
                  <ArrowUpIcon aria-hidden="true" />
                </Button>
              }
            />
          </ComposerActionGroup>
        </ComposerActions>
      </Composer>
    </div>
  );
};

const ChatMessages = () => {
  const messages = useChatState((state) => state.messages);

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messages.length) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length]);

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="flex flex-col gap-1">
        <AnimatePresence initial={false}>
          {messages.map((m, index) => (
            <Message key={m.id} message={m} previousMessage={index ? messages.at(index - 1) : null} />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};

type ChatT = {
  readonly?: boolean;
  token?: string;
};

const ChatInner = ({ readonly = false }: ChatT) => {
  return (
    <div className="flex gap-4 size-full flex-col justify-between align-center">
      <ChatMessages />
      {readonly ? null : <ChatInput />}
    </div>
  );
};

const decoder = new TextDecoder();

export const Chat = ({ readonly = false, token }: ChatT) => {
  const isTablet = useIsTablet();
  const showChat = useControls((state) => state.showChat);
  const setControls = useControls((state) => state.set);
  const closePanel = () => setControls("showChat", false);

  const addMessage = useChatState((state) => state.addMessage);

  useDataChannel("chat", (msg: ReceivedDataMessage) => {
    if (msg.from) {
      return;
    }
    const result = ChatMessageSchema.safeParse(decoder.decode(msg.payload));
    if (result.success) {
      addMessage(result.data);
    }
  });

  const room = useRoomContext();
  const clear = useChatState((state) => state.clear);
  const setMessages = useChatState((state) => state.setMessages);
  const getChatMessages = useServerFn(getChatMessagesFn);
  useEffect(() => {
    getChatMessages({ data: { roomId: room.name, token } }).then((messages) => setMessages(messages));
    return clear;
  }, [clear, getChatMessages, room.name, setMessages, token]);

  return (
    <>
      <Dialog open={isTablet && showChat} onOpenChange={closePanel}>
        <DialogPopup portalProps={{ keepMounted: true }} className="h-full min-h-48" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>{m.chat_label()}</DialogTitle>
          </DialogHeader>
          <div className="flex min-h-40 p-6">
            <div className="min-h-0 flex-1">
              <ChatInner readonly={readonly} />
            </div>
          </div>
        </DialogPopup>
      </Dialog>
      {!isTablet && showChat ? (
        <Card className="flex basis-1/4 size-full min-h-0 justify-end gap-4 py-4">
          <div className="flex size-full min-h-0 flex-col px-4">
            <ChatInner readonly={readonly} />
          </div>
        </Card>
      ) : null}
      <AudioSyncBridge />
    </>
  );
};
