import { Button } from "@byte-quest/ui/primitives/button";
import { Field, FieldLabel } from "@byte-quest/ui/primitives/field";
import { Input } from "@byte-quest/ui/primitives/input";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

export const OtpSignIn = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pending, setPending] = useState(false);

  const handleSendCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    setPending(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });
    setPending(false);

    if (error) {
      toast.error(error.message || "We could not send the code");
      return;
    }

    setStep("otp");
    toast.success(`Code sent to ${email}`);
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (otp.trim().length < 6) {
      toast.error("Enter the 6-digit code");
      return;
    }

    setPending(true);
    const { error } = await authClient.signIn.emailOtp({
      email,
      otp: otp.trim(),
    });
    setPending(false);

    if (error) {
      toast.error(error.message || "That code did not work");
      return;
    }

    toast.success("Welcome to BYTE QUEST");
    navigate({ to: "/" });
  };

  const handleReset = () => {
    setOtp("");
    setStep("email");
  };

  const handleResend = async () => {
    setPending(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });
    setPending(false);

    if (error) {
      toast.error(error.message || "We could not resend the code");
      return;
    }

    toast.success(`New code sent to ${email}`);
  };

  return (
    <div className="grid gap-6">
      {step === "email" ? (
        <form className="grid gap-5" onSubmit={handleSendCode}>
          <Field>
            <FieldLabel htmlFor="email">School email</FieldLabel>
            <Input
              autoComplete="email"
              autoFocus
              id="email"
              name="email"
              onChange={(event) => setEmail(event.currentTarget.value)}
              placeholder="you@school.lk"
              required
              type="email"
              value={email}
            />
          </Field>
          <Button aria-busy={pending} disabled={pending} type="submit">
            {pending ? "Sending code…" : "Send me a code"}
          </Button>
        </form>
      ) : (
        <form className="grid gap-5" onSubmit={handleVerify}>
          <div className="flex items-center justify-between gap-3">
            <FieldLabel>Six-digit code</FieldLabel>
            <button
              className="text-muted-2 hover:text-volt cursor-pointer border-none bg-transparent p-0 font-mono text-[11px] tracking-[0.08em] transition-colors"
              onClick={handleReset}
              type="button"
            >
              CHANGE EMAIL
            </button>
          </div>
          <Field>
            <Input
              autoComplete="one-time-code"
              autoFocus
              inputMode="numeric"
              maxLength={6}
              name="otp"
              onChange={(event) => setOtp(event.currentTarget.value)}
              placeholder="••••••"
              required
              value={otp}
            />
          </Field>
          <Button aria-busy={pending} disabled={pending} type="submit">
            {pending ? "Verifying…" : "Verify & continue"}
          </Button>
          <button
            className="text-muted-2 hover:text-volt cursor-pointer border-none bg-transparent p-0 text-left text-[13px] transition-colors"
            disabled={pending}
            onClick={handleResend}
            type="button"
          >
            Resend the code
          </button>
        </form>
      )}
    </div>
  );
};
