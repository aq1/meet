import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "#/lib/user-store";

type PreConnectDialogProps = {
  open: boolean;
  onSubmit: () => void;
};

export const PreConnectDialog = ({ open, onSubmit }: PreConnectDialogProps) => {
  const username = useUser((state) => state.username);
  const updateUsername = useUser((state) => state.updateUsername);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim()) {
      return;
    }
    onSubmit();
  };

  return (
    <Dialog open={open}>
      <DialogPopup className="md:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Join room</DialogTitle>
          <DialogDescription>
            Choose a name to display to others before you connect.
          </DialogDescription>
        </DialogHeader>
        <Form className="contents" onSubmit={handleSubmit}>
          <DialogPanel className="grid gap-4">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input
                autoFocus
                value={username}
                onChange={(event) => updateUsername(event.target.value)}
                placeholder="Your name"
                type="text"
              />
            </Field>
          </DialogPanel>
          <DialogFooter>
            <Button type="submit" disabled={!username.trim()}>
              Connect
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};
