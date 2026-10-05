import { cn } from "@byte-quest/ui/lib/utils";
import type { ReactNode } from "react";

type GlyphProps = {
  className?: string;
};

function Diamond({ className }: GlyphProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("bg-volt inline-block size-1.5 rotate-45", className)}
    />
  );
}

type IconChipTone = "volt" | "gold" | "teal" | "mint";

const chipToneClasses = {
  volt: "border-volt/35",
  gold: "border-gold/40",
  teal: "border-teal/40",
  mint: "border-mint/30",
} satisfies Record<IconChipTone, string>;

const chipDotClasses = {
  volt: "bg-volt",
  gold: "bg-gold",
  teal: "bg-teal",
  mint: "bg-mint",
} satisfies Record<IconChipTone, string>;

type IconChipProps = {
  tone?: IconChipTone;
  className?: string;
  children?: ReactNode;
};

function IconChip({ tone = "volt", className, children }: IconChipProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-[26px] shrink-0 items-center justify-center rounded-[7px] border",
        chipToneClasses[tone],
        className
      )}
    >
      {children ?? <Diamond className={cn("size-[7px]", chipDotClasses[tone])} />}
    </span>
  );
}

export { Diamond, IconChip };
export type { IconChipTone };