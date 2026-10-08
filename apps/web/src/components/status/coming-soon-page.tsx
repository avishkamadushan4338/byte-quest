import { cn } from "@byte-quest/ui/lib/utils";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import {
  StatusHeader,
  StatusShell,
  statusSecondaryButton,
} from "./status-shell";

const BRAND_SRC = "/assets/bq-logo.png";
const SACOBA_SRC = "/assets/sacoba-logo.png";
const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_DESCRIPTION =
  "A three-month innovation and coding programme for Sri Lanka's young innovators. Get notified the moment registrations open.";
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/u;

interface ComingSoonPageProps {
  description?: string;
  heading?: string;
  /** Called with a validated email address. Throw to surface a failure. */
  onSubscribe?: (email: string) => Promise<void> | void;
}

export const ComingSoonPage = ({
  description = DEFAULT_DESCRIPTION,
  heading = "Something big is coming.",
  onSubscribe,
}: ComingSoonPageProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubscribe?.(trimmed);
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <StatusShell
      background="radial-gradient(45% 55% at 50% 40%, rgba(82,255,61,.13), rgba(0,169,154,.05) 50%, transparent 80%), #020807"
      className="flex min-h-svh flex-col"
    >
      <StatusHeader
        label=""
        linkHome={false}
        showBrand={false}
        trailing={
          <span className="text-gold-bright inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] whitespace-nowrap">
            <span
              aria-hidden="true"
              className="bg-volt animate-pulse-dot size-1.5 rounded-full shadow-[0_0_10px_var(--color-volt)] motion-reduce:animate-none"
            />
            LAUNCHING SOON
          </span>
        }
      />

      <main className="flex flex-1 items-center justify-center px-[clamp(20px,5vw,64px)] pt-8 pb-12">
        <div className="flex w-full max-w-[720px] flex-col items-center text-center">
          <img
            alt="BYTE QUEST"
            className="block h-auto w-[min(100%,560px)]"
            src={BRAND_SRC}
          />
          <div className="font-display text-muted mt-[22px] text-[clamp(13px,1.3vw,16px)] font-semibold tracking-[0.2em]">
            LEARN. BUILD. <span className="text-lime">INNOVATE.</span>{" "}
            <span className="text-gold-bright">INSPIRE.</span>
          </div>
          <h1 className="font-display mt-9 mb-0 text-[clamp(30px,4vw,52px)] leading-[1.02] font-bold tracking-[-0.035em]">
            {heading}
          </h1>
          <p className="text-muted mt-3.5 mb-0 max-w-[480px] text-[16px] leading-[1.6]">
            {description}
          </p>

          {done ? (
            <output className="text-fg-dim mt-7 inline-flex items-center gap-2.5 rounded-full border border-[rgba(82,255,61,0.35)] bg-[rgba(82,255,61,0.08)] px-5 py-3.5 text-[14.5px]">
              <span className="text-volt font-bold">✓</span>
              You&apos;re on the list. We&apos;ll be in touch.
            </output>
          ) : (
            <>
              <form
                className={cn(
                  "bg-surface mt-7 flex w-full max-w-[460px] gap-1.5 rounded-full border p-1.5",
                  error
                    ? "border-[rgba(255,138,122,0.5)]"
                    : "border-[rgba(185,245,208,0.14)]"
                )}
                noValidate
                onSubmit={handleSubmit}
              >
                <label className="flex min-w-0 flex-1">
                  <span className="sr-only">Email address</span>
                  <input
                    aria-describedby={error ? "notify-error" : undefined}
                    aria-invalid={Boolean(error)}
                    autoComplete="email"
                    className="text-fg placeholder:text-faint min-w-0 flex-1 border-0 bg-transparent px-4 text-[15px] outline-none"
                    onChange={handleChange}
                    placeholder="Your email address"
                    type="email"
                    value={email}
                  />
                </label>
                <button
                  className="bg-volt text-ink hover:bg-lime cursor-pointer rounded-full border-0 px-5 py-[13px] text-[14px] font-bold whitespace-nowrap transition-colors duration-200 disabled:opacity-60"
                  disabled={submitting}
                  type="submit"
                >
                  Notify me
                </button>
              </form>
              <div
                className="mt-2 min-h-[18px] text-[12.5px] text-[#ff8a7a]"
                id="notify-error"
                role="alert"
              >
                {error}
              </div>
            </>
          )}

          <Link className={`${statusSecondaryButton} mt-6`} to="/">
            <ArrowLeftIcon aria-hidden="true" className="mr-2" weight="bold" />
            Back to home
          </Link>
        </div>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-5 border-t border-[rgba(185,245,208,0.07)] px-[clamp(20px,5vw,64px)] pt-6 pb-8">
        <div className="flex items-center gap-4">
          <span className="text-faint font-mono text-[10px] tracking-[0.14em]">
            PRESENTED BY
          </span>
          <img
            alt="SACOBA — Old Boys' Association, St. Aloysius' College"
            className="h-10 w-auto"
            src={SACOBA_SRC}
          />
        </div>
        <span className="text-faint-2 font-mono text-[10.5px] tracking-[0.1em]">
          © {CURRENT_YEAR} BYTE QUEST
        </span>
      </footer>
    </StatusShell>
  );
};
