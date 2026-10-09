import { cn } from "@byte-quest/ui/lib/utils";
import type { ReactNode } from "react";

import { Check } from "@byte-quest/ui/components/icons";
import { ProgressIndicator, ProgressRoot, ProgressTrack } from "@byte-quest/ui/primitives/progress";

type Step = {
  label: string;
};

type StepsProps = {
  steps: Step[];
  current: number;
  maxVisited?: number;
  onSelect?: (index: number) => void;
  className?: string;
};

function Steps({ steps, current, maxVisited, onSelect, className }: StepsProps) {
  return (
    <ol className={cn("grid gap-1", className)}>
      {steps.map((step, index) => {
        const isComplete = index < current;
        const isCurrent = index === current;
        const isLocked = (maxVisited ?? current) < index;
        const canSelect = !isLocked && Boolean(onSelect);

        return (
          <li key={step.label}>
            <button
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-[10px] border border-transparent p-2.5 text-left transition-colors",
                isCurrent
                  ? "bg-volt/7 text-fg"
                  : "text-muted-2",
                isLocked ? "cursor-default" : "hover:bg-volt/5"
              )}
              disabled={isLocked}
              onClick={canSelect ? () => onSelect?.(index) : undefined}
              type="button"
            >
              <span
                className={cn(
                  "flex size-[26px] shrink-0 items-center justify-center rounded-lg border font-mono text-[13px] transition-colors",
                  isComplete
                    ? "border-transparent bg-volt text-ink"
                    : isCurrent
                      ? "border-volt/50 text-volt"
                      : "border-line-strong text-faint"
                )}
              >
                {isComplete ? (
                  <Check className="size-3.5" />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </span>
              <span className={cn(isCurrent ? "text-fg" : isLocked && "text-faint")}>
                {step.label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

type ChecklistProps = {
  items: { label: string; done: boolean }[];
  className?: string;
};

function Checklist({ items, className }: ChecklistProps) {
  return (
    <ul className={cn("grid gap-3", className)}>
      {items.map((item) => (
        <li className="flex items-center gap-3" key={item.label}>
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
              item.done
                ? "border-transparent bg-volt text-ink"
                : "border-line-strong bg-transparent"
            )}
          >
            {item.done ? <Check className="size-3" /> : null}
          </span>
          <span
            className={cn("text-[14px]", item.done ? "text-fg" : "text-muted")}
          >
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

type ProgressMeterProps = {
  value: number;
  max: number;
  label?: ReactNode;
  className?: string;
};

function ProgressMeter({ value, max, label, className }: ProgressMeterProps) {
  return (
    <ProgressRoot className={className} max={max} value={value}>
      {label ? <span className="text-muted-2 font-mono text-[12.5px] tracking-[0.14em] uppercase">{label}</span> : null}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressRoot>
  );
}

export { Checklist, ProgressMeter, Steps };
export type { ChecklistProps, ProgressMeterProps, StepsProps };