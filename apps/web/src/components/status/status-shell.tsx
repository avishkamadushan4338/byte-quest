import { cn } from "@byte-quest/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const CREST_SRC = "/assets/crest.png";
const BRAND_SRC = "/assets/bq-logo.png";

interface StatusShellProps {
  background: string;
  children: ReactNode;
  className?: string;
}

/** Full-viewport layer that sits above the site header, footer and ambient glow. */
export const StatusShell = ({
  background,
  children,
  className,
}: StatusShellProps) => (
  <div
    className={cn(
      "bg-ink text-fg fixed inset-0 z-[70] overflow-x-hidden overflow-y-auto",
      className
    )}
    style={{ background }}
  >
    {children}
  </div>
);

interface StatusHeaderProps {
  label: string;
  labelClassName?: string;
  linkHome?: boolean;
  showBrand?: boolean;
  trailing?: ReactNode;
}

export const StatusHeader = ({
  label,
  labelClassName,
  linkHome = true,
  showBrand = true,
  trailing,
}: StatusHeaderProps) => {
  const lockup = (
    <>
      <img
        alt="St. Aloysius' College crest"
        className="h-9 w-auto"
        src={CREST_SRC}
      />
      {showBrand ? (
        <img alt="BYTE QUEST" className="h-4 w-auto" src={BRAND_SRC} />
      ) : null}
    </>
  );

  return (
    <header className="relative z-[3] flex items-center justify-between gap-4 px-[clamp(20px,5vw,64px)] py-6">
      {linkHome ? (
        <Link
          aria-label="BYTE QUEST home"
          className="flex items-center gap-3.5"
          to="/"
        >
          {lockup}
        </Link>
      ) : (
        <span className="flex items-center gap-3.5">{lockup}</span>
      )}
      {trailing ?? (
        <span
          className={cn(
            "text-faint font-mono text-[11px] tracking-[0.18em] whitespace-nowrap",
            labelClassName
          )}
        >
          {label}
        </span>
      )}
    </header>
  );
};

export const statusPrimaryButton =
  "bg-volt text-ink hover:bg-lime hover:text-ink inline-flex cursor-pointer items-center rounded-full border-0 px-[26px] py-[15px] text-[14.5px] font-bold whitespace-nowrap shadow-[0_10px_36px_-12px_rgba(82,255,61,0.7)] transition-colors duration-200";

export const statusSecondaryButton =
  "text-fg hover:text-fg inline-flex items-center rounded-full border border-[rgba(242,247,244,0.24)] bg-[rgba(2,8,7,0.5)] px-[26px] py-[15px] text-[14.5px] font-semibold whitespace-nowrap transition-colors duration-200 hover:border-volt";
