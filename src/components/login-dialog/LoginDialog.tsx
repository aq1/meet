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
    <Dialog open={true}>
      <DialogPopup className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
        </DialogHeader>
        <Form
          className="contents"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const username = String(fd.get("username") ?? "");
            user.updateUsername(username);
          }}
        >
          <DialogPanel className="grid gap-4">
            <Field>
              <Input
                defaultValue={user.username}
                type="text"
                name="username"
                required
              />
            </Field>
          </DialogPanel>
          <DialogFooter>
            <Button type="submit" title="Sign in">
              Sign in
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};
