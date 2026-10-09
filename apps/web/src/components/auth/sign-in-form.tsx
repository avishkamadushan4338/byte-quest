import { cn } from "@byte-quest/ui/lib/utils";
import { Button } from "@byte-quest/ui/primitives/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@byte-quest/ui/primitives/field";
import { Input } from "@byte-quest/ui/primitives/input";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

const GENERIC_FAILURE =
  "Those credentials were not recognised. Check them and try again.";

const MIN_PASSWORD_LENGTH = 8;

export const SignInForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    form?: string;
  }>({});
  const [pending, setPending] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (username.trim().length < 3) {
      next.username = "Enter your username";
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    if (!validate()) {
      return;
    }

    setPending(true);
    const { error } = await authClient.signIn.username({
      username: username.trim(),
      password,
    });
    setPending(false);

    if (error) {
      setErrors({ form: GENERIC_FAILURE });
      toast.error(GENERIC_FAILURE);
      return;
    }

    toast.success("Welcome back to BYTE QUEST");
    await router.navigate({ to: "/dashboard", reloadDocument: true });
  };

  return (
    <form className="grid gap-5" noValidate onSubmit={handleSubmit}>
      <Field invalid={Boolean(errors.username)}>
        <FieldLabel>Username</FieldLabel>
        <Input
          aria-describedby={errors.username ? "username-error" : undefined}
          aria-invalid={Boolean(errors.username) || undefined}
          autoCapitalize="none"
          autoComplete="username"
          autoFocus
          id="username"
          name="username"
          onChange={(event) => setUsername(event.currentTarget.value)}
          placeholder="your-username"
          spellCheck={false}
          value={username}
        />
        {errors.username ? (
          <FieldError id="username-error">{errors.username}</FieldError>
        ) : null}
      </Field>

      <Field invalid={Boolean(errors.password)}>
        <div className="flex items-center justify-between gap-3">
          <FieldLabel>Password</FieldLabel>
          <button
            aria-pressed={revealed}
            className="text-muted-2 hover:text-volt -m-2 cursor-pointer border-none bg-transparent p-2 font-mono text-[13px] tracking-[0.08em] uppercase transition-colors"
            onClick={() => setRevealed((current) => !current)}
            type="button"
          >
            {revealed ? "Hide" : "Show"}
          </button>
        </div>
        <Input
          aria-describedby={errors.password ? "password-error" : undefined}
          aria-invalid={Boolean(errors.password) || undefined}
          autoCapitalize="none"
          autoComplete="current-password"
          id="password"
          name="password"
          onChange={(event) => setPassword(event.currentTarget.value)}
          placeholder="••••••••"
          type={revealed ? "text" : "password"}
          value={password}
        />
        {errors.password ? (
          <FieldError id="password-error">{errors.password}</FieldError>
        ) : (
          <FieldDescription>
            At least {MIN_PASSWORD_LENGTH} characters.
          </FieldDescription>
        )}
      </Field>

      {errors.form ? (
        <p
          aria-live="assertive"
          className={cn(
            "border-destructive/40 text-destructive rounded-[14px] border px-4 py-3 text-[15.5px]"
          )}
          role="alert"
        >
          {errors.form}
        </p>
      ) : null}

      <Button aria-busy={pending} disabled={pending} type="submit">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
};
