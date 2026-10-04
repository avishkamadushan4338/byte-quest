import type { HTMLAttributes } from "react";
import { cn } from "@byte-quest/ui/lib/utils";

type KickerTone = "teal" | "volt" | "lime" | "gold" | "faint";

const toneClasses = {
  teal: "text-teal",
  volt: "text-volt",
  lime: "text-lime",
  gold: "text-gold",
  faint: "text-faint",
} satisfies Record<KickerTone, string>;

type KickerProps = HTMLAttributes<HTMLDivElement> & {
  tone?: KickerTone;
};

function Kicker({ tone = "teal", className, ...props }: KickerProps) {
  return (
    <div
      className={cn(
        "font-mono text-[11px] leading-none tracking-[0.16em] uppercase",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}

export { Kicker };
export type { KickerProps, KickerTone };
