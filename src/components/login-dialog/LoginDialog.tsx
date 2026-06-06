import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "#/components/ui/dialog";
import { Field } from "#/components/ui/field";
import { Form } from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { useUser } from "#/lib/user-store";

export const LoginDialog = () => {
  const user = useUser();

  return (
    <Dialog open={!user.username}>
      <DialogPopup className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Choose username</DialogTitle>
        </DialogHeader>
        <Form
          className="contents"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            user.updateUsername(fd.get("username"));
          }}
        >
          <DialogPanel className="grid gap-4">
            <Field>
              <Input type="text" name="username" required />
            </Field>
          </DialogPanel>
          <DialogFooter>
            <Button type="submit">Enter the room</Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};
