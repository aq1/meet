import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { getSession } from "@/apps/auth/functions/get-session";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OTPField, OTPFieldInput } from "@/components/ui/otp-field";
import { authClient } from "@/lib/auth/client";
import { m } from "@/paraglide/messages";

const OTP_LENGTH = 6;
const OTP_SLOTS = ["a", "b", "c", "d", "e", "f"];

export const Route = createFileRoute("/_public/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: async ({ search }) => {
    const session = await getSession();
    if (session && !session.user.isAnonymous) {
      throw redirect({ href: safeRedirect(search.redirect) });
    }
  },
  component: LoginPage,
});

function safeRedirect(target: string | undefined) {
  return target?.startsWith("/") && !target.startsWith("//") ? target : "/";
}

function LoginPage() {
  const navigate = useNavigate();
  const { redirect: target } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: email.trim(),
      type: "sign-in",
    });
    setPending(false);
    if (error) {
      setError(error.message ?? m.login_send_code_error());
      return;
    }
    setStep("otp");
  };

  const verifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const { error } = await authClient.signIn.emailOtp({
      email: email.trim(),
      otp,
    });
    setPending(false);
    if (error) {
      setError(error.message ?? m.login_invalid_code());
      setOtp("");
      return;
    }
    await navigate({ href: safeRedirect(target), replace: true });
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        {step === "email" ? (
          <Form className="contents" onSubmit={sendCode}>
            <CardHeader>
              <CardTitle>{m.login_title()}</CardTitle>
              <CardDescription>{m.login_description()}</CardDescription>
            </CardHeader>
            <CardPanel>
              <Field>
                <FieldLabel>{m.login_email_label()}</FieldLabel>
                <Input
                  autoFocus
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={m.login_email_placeholder()}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error ? <FieldError match>{error}</FieldError> : null}
              </Field>
            </CardPanel>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={pending}>
                {m.login_send_code()}
              </Button>
            </CardFooter>
          </Form>
        ) : (
          <Form className="contents" onSubmit={verifyCode}>
            <CardHeader>
              <CardTitle>{m.login_check_email_title()}</CardTitle>
              <CardDescription>{m.login_check_email_description({ length: OTP_LENGTH, email })}</CardDescription>
            </CardHeader>
            <CardPanel>
              <Field>
                <FieldLabel>{m.login_code_label()}</FieldLabel>
                <OTPField autoFocus length={OTP_LENGTH} size="lg" value={otp} onValueChange={setOtp} autoSubmit>
                  {OTP_SLOTS.map((slot) => (
                    <OTPFieldInput key={slot} />
                  ))}
                </OTPField>
                {error ? <FieldError match>{error}</FieldError> : null}
              </Field>
            </CardPanel>
            <CardFooter className="grid gap-2">
              <Button type="submit" className="w-full" disabled={pending || otp.length !== OTP_LENGTH}>
                {m.login_submit()}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                disabled={pending}
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError(null);
                }}
              >
                {m.login_use_different_email()}
              </Button>
            </CardFooter>
          </Form>
        )}
      </Card>
    </div>
  );
}
