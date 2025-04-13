import { createFileRoute, Link } from "@tanstack/react-router";
import { socket } from "~/socket";
import { Piano, sendNoteSignal, type NoteSignalT } from "~/components/Piano";
import { useEventBus } from "~/components/Event";
import { useEffect, useState } from "react";
import { Input, WebMidi } from "webmidi";
import {
  Button,
  DropdownMenu,
  Text,
  Code,
  AlertDialog,
} from "@radix-ui/themes";
import * as Tone from "tone";

export const Route = createFileRoute("/r/$roomId")({
  component: RouteComponent,
  onEnter: ({ params }) => {
    socket.connect();
    socket.emit("join", params.roomId);
    socket.on("note_down", (data: NoteSignalT) => {
      delete data.local;
      sendNoteSignal("noteDown", data);
    });
    socket.on("note_up", (data: NoteSignalT) => {
      delete data.local;
      sendNoteSignal("noteUp", data);
    });
  },
  onLeave: ({ params }) => {
    socket.emit("join", params.roomId);
    socket.disconnect();
  },
  head: ({ params }) => ({
    meta: [
      {
        title: `Room ${params.roomId}`,
      },
    ],
  }),
});

const getSamplerUrls = () => ({
  A0: "A0.mp3",
  A1: "A1.mp3",
  A2: "A2.mp3",
  A3: "A3.mp3",
  A4: "A4.mp3",
  A5: "A5.mp3",
  A6: "A6.mp3",
  A7: "A7.mp3",
  C1: "C1.mp3",
  C2: "C2.mp3",
  C3: "C3.mp3",
  C4: "C4.mp3",
  C5: "C5.mp3",
  C6: "C6.mp3",
  C7: "C7.mp3",
  C8: "C8.mp3",
  "D#1": "Ds1.mp3",
  "D#2": "Ds2.mp3",
  "D#3": "Ds3.mp3",
  "D#4": "Ds4.mp3",
  "D#5": "Ds5.mp3",
  "D#6": "Ds6.mp3",
  "D#7": "Ds7.mp3",
  "F#1": "Fs1.mp3",
  "F#2": "Fs2.mp3",
  "F#3": "Fs3.mp3",
  "F#4": "Fs4.mp3",
  "F#5": "Fs5.mp3",
  "F#6": "Fs6.mp3",
  "F#7": "Fs7.mp3",
});

function RouteComponent({ roomId }: { roomId: string }) {
  useEventBus<NoteSignalT>("noteDown", (detail) => {
    if (detail.local) {
      socket.emit("note_down", roomId, {
        note: detail.note,
        octave: detail.octave,
      });
    }
  });
  useEventBus<NoteSignalT>("noteUp", (detail) => {
    if (detail.local) {
      socket.emit("note_up", roomId, {
        note: detail.note,
        octave: detail.octave,
      });
    }
  });

  const [showDialog, setShowDialog] = useState(true);
  const [sampler, setSampler] = useState<Tone.Sampler>();
  const [devices, setDevices] = useState<Array<Input>>([]);
  const [activeDevice, setActiveDevice] = useState<Input | undefined>();

  const init = async () => {
    await Tone.start();
    setSampler(
      new Tone.Sampler({
        urls: getSamplerUrls(),
        release: 1,
        baseUrl: "https://tonejs.github.io/audio/salamander/",
      }).toDestination()
    );
    WebMidi.enable().then(() => {
      WebMidi.addListener("connected", updateDevices);
      WebMidi.addListener("disconnected", updateDevices);
      updateDevices();
    });
    setShowDialog(false);
  };

  const updateDevices = () => {
    if (WebMidi.inputs) {
      setDevices(WebMidi.inputs);
      if (!activeDevice) {
        setActiveDevice(WebMidi.inputs[0]);
      }
    }
  };

  useEffect(() => {
    return () => {
      WebMidi.disable();
    };
  }, []);

  return (
    <>
      <AlertDialog.Root open={showDialog}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Ready to join the room?</AlertDialog.Title>
          <AlertDialog.Description>
            You will be asked to give access to MIDI devices.
          </AlertDialog.Description>
          <div className="flex mt-4 gap-3 justify-end">
            <AlertDialog.Action>
              <Link to="/">
                <Button variant="soft">Exit</Button>
              </Link>
            </AlertDialog.Action>
            <AlertDialog.Action>
              <Button variant="solid" onClick={init}>
                Join
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {showDialog ? null : (
        <div className="w-dvw h-dvh flex flex-col justify-between gap-x-4 gap-y-2">
          <div className="w-full h-10 flex justify-between p-2">
            <div className="flex gap-4 items-center">
              <div>
                <Link to="/">
                  <Button variant="soft">Back</Button>
                </Link>
              </div>
              <div className="flex gap-1 items-center">
                <Text size="2">Share Room:</Text>

                <Code size="2" variant="soft" className="cursor-pointer">
                  {window.location.href} <i className="ri-file-copy-line"></i>
                </Code>
              </div>
            </div>
            <div>
              {devices.length > 1 ? (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft">
                      {activeDevice ? activeDevice.name : "Select MIDI"}
                      <DropdownMenu.TriggerIcon />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {devices.map((d) => (
                      <DropdownMenu.Item
                        key={d.id}
                        onClick={() => {
                          setActiveDevice(d);
                        }}
                      >
                        {d.name}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              ) : (
                <Button variant="soft">
                  {activeDevice ? activeDevice.name : "No MIDI"}
                  <DropdownMenu.TriggerIcon />
                </Button>
              )}
            </div>
          </div>
          <div>
            <Piano midiInput={activeDevice} sampler={sampler} />
          </div>
        </div>
      )}
    </>
  );
}
