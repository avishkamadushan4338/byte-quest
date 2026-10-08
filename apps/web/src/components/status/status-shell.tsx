import { cn } from "@byte-quest/ui/lib/utils";
import type { ReactNode } from "react";

interface StatusShellProps {
  background: string;
  children: ReactNode;
  className?: string;
}

/**
 * In-flow page surface for status routes. It stays in the document flow so the
 * site header and footer keep working around it — a fixed layer would collapse
 * to zero height inside the page-transition transform and leave the route blank.
 */
export const StatusShell = ({
  background,
  children,
  className,
}: StatusShellProps) => (
  <div
    className={cn("bg-ink text-fg relative w-full overflow-hidden", className)}
    style={{ background }}
  >
    {children}
  </div>
);

/** Full-viewport layer that covers the site chrome while the router is pending. */
export const StatusOverlay = ({
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

export const statusPrimaryButton =
  "bg-volt text-ink hover:bg-lime hover:text-ink inline-flex cursor-pointer items-center rounded-full border-0 px-[26px] py-[15px] text-[14.5px] font-bold whitespace-nowrap shadow-[0_10px_36px_-12px_rgba(82,255,61,0.7)] transition-colors duration-200";

export const statusSecondaryButton =
  "text-fg hover:text-fg inline-flex items-center rounded-full border border-[rgba(242,247,244,0.24)] bg-[rgba(2,8,7,0.5)] px-[26px] py-[15px] text-[14.5px] font-semibold whitespace-nowrap transition-colors duration-200 hover:border-volt";
