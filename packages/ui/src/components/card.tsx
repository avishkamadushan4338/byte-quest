import type { HTMLAttributes } from "react";
import { cn } from "@byte-quest/ui/lib/utils";

type CardVariant = "surface" | "raised";

const variantClasses = {
  surface:
    "border border-line-soft bg-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
  raised:
    "border border-line-soft bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0)),#030F0B] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
} satisfies Record<CardVariant, string>;

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

function Card({ variant = "surface", className, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-[20px]", variantClasses[variant], className)}
      {...props}
    />
  );
}

export { Card };
export type { CardProps, CardVariant };
