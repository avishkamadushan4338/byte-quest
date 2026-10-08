import { Link, useRouter } from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { useMemo } from "react";

import { StatusShell, statusSecondaryButton } from "./status-shell";

const REFERENCE_LENGTH = 6;

const createReference = () =>
  `ERR-${Math.random()
    .toString(36)
    .slice(2, 2 + REFERENCE_LENGTH)
    .toUpperCase()}`;

const formatTimestamp = () =>
  new Date()
    .toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })
    .toUpperCase();

export const ErrorPage = ({ reset }: Pick<ErrorComponentProps, "reset">) => {
  const router = useRouter();
  // Random per render context, so the server/client mismatch is expected.
  const details = useMemo(
    () => ({
      reference: createReference(),
      time: formatTimestamp(),
    }),
    []
  );

  const retry = async () => {
    reset();
    await router.invalidate();
  };

  return (
    <StatusShell
      background="radial-gradient(50% 50% at 50% 40%, rgba(255,138,122,.07), transparent 75%), #020807"
      className="flex min-h-svh flex-col pt-[clamp(104px,12vw,150px)]"
    >
      <main
        className="flex flex-1 items-center justify-center px-[clamp(20px,5vw,64px)] pt-10 pb-16"
        role="alert"
      >
        <div className="flex w-full max-w-[640px] flex-col items-center text-center">
          <div
            aria-hidden="true"
            className="font-display flex size-[76px] items-center justify-center rounded-[22px] border border-[rgba(255,138,122,0.4)] bg-[radial-gradient(circle,rgba(255,138,122,0.16),transparent_70%)] text-[34px] font-bold text-[#ff8a7a] shadow-[0_0_40px_-10px_rgba(255,138,122,0.6)]"
          >
            !
          </div>
          <div className="mt-7 font-mono text-[11px] tracking-[0.18em] text-[#ff8a7a]">
            SOMETHING WENT WRONG
          </div>
          <h1 className="font-display mt-3.5 mb-0 text-[clamp(30px,4vw,52px)] leading-none font-bold tracking-[-0.035em]">
            We hit an unexpected bug.
          </h1>
          <p className="text-muted mt-4 mb-0 max-w-[460px] text-[16px] leading-[1.6]">
            It&apos;s not you — it&apos;s us. Please try again in a moment. If
            the problem continues, contact the organising committee.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            <button
              className="bg-volt text-ink hover:bg-lime inline-flex cursor-pointer items-center rounded-full border-0 px-6 py-[15px] text-[14.5px] font-bold whitespace-nowrap transition-colors duration-200"
              onClick={retry}
              type="button"
            >
              Try again ↻
            </button>
            <Link className={statusSecondaryButton} to="/">
              Back to home
            </Link>
          </div>
          <div className="bg-surface mt-11 flex min-h-[46px] w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-[14px] border border-[rgba(185,245,208,0.08)] px-[18px] py-3.5 font-mono text-[11px] tracking-[0.08em]">
            <span className="text-faint">
              REFERENCE{" "}
              <span className="text-fg-dim" suppressHydrationWarning>
                {details.reference}
              </span>
            </span>
            <span className="text-faint" suppressHydrationWarning>
              {details.time}
            </span>
          </div>
        </div>
      </main>
    </StatusShell>
  );
};
