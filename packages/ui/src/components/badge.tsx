import type { HTMLAttributes } from "react";
import { cn } from "@byte-quest/ui/lib/utils";

type BadgeTone = "neutral" | "volt" | "teal" | "gold" | "mint";

const toneClasses = {
  neutral: "border-line-strong text-muted",
  volt: "border-volt/40 text-volt",
  teal: "border-teal/40 text-teal",
  gold: "border-gold/40 text-gold-bright",
  mint: "border-mint/40 text-mint",
} satisfies Record<BadgeTone, string>;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-[5px] font-mono text-[10.5px] tracking-[0.12em] whitespace-nowrap uppercase",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
export type { BadgeProps, BadgeTone };
