import type { HTMLAttributes } from "react";
import { cn } from "@byte-quest/ui/lib/utils";

type BrandProps = HTMLAttributes<HTMLSpanElement> & {
  size?: "sm" | "lg";
};

function Brand({ size = "sm", className, ...props }: BrandProps) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-display font-bold whitespace-nowrap",
        size === "lg" ? "text-[28px] tracking-[-0.03em]" : "text-[17px] tracking-[-0.01em]",
        className
      )}
      {...props}
    >
      BYTE<span className="text-volt">/</span>QUEST
    </span>
  );
}

type BrandLockupProps = {
  crestSrc: string;
  crestAlt?: string;
  size?: "sm" | "lg";
  tagline?: string;
  crestClassName?: string;
  className?: string;
};

function BrandLockup({
  crestSrc,
  crestAlt = "St. Aloysius' College crest",
  size = "sm",
  tagline = "SACG · OBA",
  crestClassName,
  className,
}: BrandLockupProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <img
        alt={crestAlt}
        className={cn(
          "w-auto transition-[height] duration-300",
          size === "lg" ? "h-[52px]" : "h-10",
          crestClassName
        )}
        src={crestSrc}
      />
      <span
        aria-hidden="true"
        className={cn("bg-line-strong", size === "lg" ? "h-7 w-px" : "h-6 w-px")}
      />
      <span className="flex flex-col leading-none">
        <Brand size={size} />
        <span className="mt-[5px] font-mono text-[9px] tracking-[0.14em] text-muted-2">
          {tagline}
        </span>
      </span>
    </span>
  );
}

export { Brand, BrandLockup };
export type { BrandLockupProps, BrandProps };
