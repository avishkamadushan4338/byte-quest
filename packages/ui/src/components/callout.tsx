import { cn } from "@byte-quest/ui/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

import { Alert, ArrowRight, Check, Close, Info } from "@byte-quest/ui/components/icons";

type CalloutTone = "info" | "success" | "warning" | "danger" | "neutral";

const calloutToneClasses = {
  info: "border-teal/30 bg-teal/8 text-teal",
  success: "border-volt/30 bg-volt/8 text-volt",
  warning: "border-gold/30 bg-gold/8 text-gold-bright",
  danger: "border-destructive/30 bg-destructive/8 text-destructive",
  neutral: "border-line-soft bg-surface text-muted",
} satisfies Record<CalloutTone, string>;

const calloutTextClasses = {
  info: "text-muted",
  success: "text-muted",
  warning: "text-muted",
  danger: "text-muted",
  neutral: "text-muted",
} satisfies Record<CalloutTone, string>;

const calloutIcons = {
  info: Info,
  success: Check,
  warning: Alert,
  danger: Close,
  neutral: Info,
} satisfies Record<CalloutTone, typeof Info>;

type CalloutProps = HTMLAttributes<HTMLDivElement> & {
  tone?: CalloutTone;
  title?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
};

function Callout({
  tone = "info",
  title,
  icon,
  action,
  className,
  children,
  ...props
}: CalloutProps) {
  const Icon = calloutIcons[tone];

  return (
    <div
      className={cn(
        "flex gap-4 rounded-[14px] border p-5",
        calloutToneClasses[tone],
        className
      )}
      {...props}
    >
      <span className="mt-0.5 shrink-0" role="img">
        {icon ?? <Icon className="size-4.5" />}
      </span>
      <div className="min-w-0 flex-1">
        {title ? (
          <div className="font-display text-fg text-[15px] font-semibold">
            {title}
          </div>
        ) : null}
        {children ? (
          <div className={cn("mt-1 text-[14px] leading-[1.6]", calloutTextClasses[tone])}>
            {children}
          </div>
        ) : null}
      </div>
      {action ? <div className="shrink-0 self-center">{action}</div> : null}
    </div>
  );
}

type EmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-[20px] border border-dashed border-line-strong px-6 py-16 text-center",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="border-line-strong text-faint-2 flex size-12 items-center justify-center rounded-[14px] border border-dashed"
      >
        {icon ?? <ArrowRight className="size-5 -rotate-45" />}
      </span>
      <div>
        <div className="font-display text-fg text-[19px] font-semibold tracking-[-0.02em]">
          {title}
        </div>
        {description ? (
          <p className="text-muted-2 mx-auto mt-2 max-w-[420px] text-[14px] leading-[1.6]">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export { Callout, EmptyState };
export type { CalloutProps, CalloutTone, EmptyStateProps };