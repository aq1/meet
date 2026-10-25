import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserIcon } from "lucide-react";
import { type ChangeEvent, type SubmitEvent, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardPanel } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toastManager } from "@/components/ui/toast";
import { authClient } from "@/lib/auth/client";
import { useUploadFile } from "@/lib/s3/use-upload-file";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/_protected/dashboard/account")({
  component: AccountPage,
});

function AccountPage() {
  const { user: authUser } = Route.useRouteContext();
  const navigate = useNavigate();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState(authUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { upload, progress } = useUploadFile({
    kind: "avatar",
    onSuccess: ({ publicUrl }) => {
      setError("");
      setUser((p) => {
        return { ...p, image: publicUrl };
      });
    },
    onError: () => setError(m.dashboard_photo_upload_error()),
  });

  const maskedEmail = user.email.replace(/^(.)[^@]*/, "$1***");

  const deletePhoto = () => {
    setUser((p) => {
      return { ...p, image: "" };
    });
  };

  const changePhoto = () => {
    photoInputRef.current?.click();
  };

  const changeName = (e: ChangeEvent<HTMLInputElement>) => {
    setUser((p) => {
      return { ...p, name: e.target.value };
    });
  };

  const logOut = async () => {
    await authClient.signOut();
    await navigate({ to: "/" });
  };

  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await authClient.updateUser({ name: user.name, image: user.image });
      setError(result.error?.message ?? "");
      if (!result.error) {
        toastManager.add({
          id: "profile-save",
          title: "Profile Saved",
        });
      }
    } catch {
      setError(m.dashboard_update_error());
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardPanel>
        <Form className="flex w-full flex-col gap-8" onSubmit={submit}>
          <Field name="image">
            <div className="w-full flex gap-4 items-center">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={upload}
              />
              <Avatar className="size-20">
                <AvatarImage alt={m.dashboard_avatar_alt()} src={user.image ?? ""} />
                <AvatarFallback>
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2 text-sm w-full">
                <span className="text-muted-foreground">{maskedEmail}</span>
                <div className="flex gap-2 text-nowrap">
                  {user.image ? (
                    <>
                      <button type="button" className="text-muted-foreground cursor-pointer" onClick={changePhoto}>
                        {m.dashboard_change_photo()}
                      </button>
                      <button
                        type="button"
                        className="text-destructive-foreground cursor-pointer"
                        onClick={deletePhoto}
                      >
                        {m.dashboard_delete_photo()}
                      </button>
                    </>
                  ) : (
                    <button type="button" className="text-foreground cursor-pointer" onClick={changePhoto}>
                      {m.dashboard_add_photo()}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Field>
          <Field name="email" className="w-full">
            <FieldLabel>{m.dashboard_name_label()}</FieldLabel>
            <Input value={user.name} placeholder={m.dashboard_name_placeholder()} onChange={changeName} required />
            <FieldError match="valueMissing">{m.dashboard_name_required()}</FieldError>
          </Field>

          {error ? <span className="text-sm text-destructive-foreground">{error}</span> : null}

          <div className="flex justify-between items-center w-full">
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="ghost" type="button" />}>
                {m.dashboard_log_out()}
              </AlertDialogTrigger>
              <AlertDialogPopup>
                <AlertDialogHeader>
                  <AlertDialogTitle>{m.dashboard_log_out_confirm()}</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogClose render={<Button variant="ghost" />}>{m.cancel()}</AlertDialogClose>
                  <AlertDialogClose render={<Button variant="destructive" onClick={logOut} />}>
                    {m.dashboard_log_out()}
                  </AlertDialogClose>
                </AlertDialogFooter>
              </AlertDialogPopup>
            </AlertDialog>
            <Button type="submit" variant="outline" loading={loading || progress !== null}>
              {m.dashboard_save()}
            </Button>
          </div>
        </Form>
      </CardPanel>
    </Card>
  );
}
