import { createServerFn, useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "#/components/ui/dialog";
import { Field, FieldError } from "#/components/ui/field";
import { Form } from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { login } from "#/lib/auth";
import { useUser } from "#/lib/user-store";

const loginFn = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(({ data }) => login(data.password));

export const LoginDialog = ({ onSubmit }: { onSubmit: () => void }) => {
  const user = useUser();
  const authenticate = useServerFn(loginFn);
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <Dialog open={true}>
      <DialogPopup className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
        </DialogHeader>
        <Form
          className="contents"
          errors={errors}
          onSubmit={async (e) => {
            e.preventDefault();
            setErrors({});
            const fd = new FormData(e.currentTarget);
            const username = String(fd.get("username") ?? "");
            const password = String(fd.get("password") ?? "");
            const result = await authenticate({ data: { password } });
            if (!result.ok) {
              setErrors({ password: result.msg });
              return;
            }
            user.updateUsername(username);
            user.updatePassword(password);
            onSubmit();
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
            <Field name="password">
              <Input
                defaultValue={user.password}
                type="password"
                name="password"
                placeholder="Password"
                required
              />
              <FieldError />
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
