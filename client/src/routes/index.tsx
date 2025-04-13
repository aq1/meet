import { Heading, Box, Button, Card, TextField, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      {
        title: "MIDI",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Box maxWidth="540px">
        <Card>
          <div className="flex flex-col gap-2 items-center">
            <div className="pb-5">
              <Heading>Let's start</Heading>
            </div>
            <div className="w-full flex justify-between gap-1">
              <TextField.Root placeholder="Room ID"></TextField.Root>
              <Button>Join</Button>
            </div>
            <Text>or</Text>
            <Button>Create a Room</Button>
          </div>
        </Card>
      </Box>
    </div>
  );
}
