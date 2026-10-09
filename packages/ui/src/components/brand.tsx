import type { ImgHTMLAttributes } from "react";
import { cn } from "@byte-quest/ui/lib/utils";

const BRAND_LOGO_SRC = "/assets/bq-logo-mark.png";

type BrandProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  size?: "sm" | "lg";
};

function Brand({ size = "sm", className, ...props }: BrandProps) {
  return (
    <img
      alt="BYTE QUEST"
      className={cn("block w-auto", size === "lg" ? "h-8" : "h-7", className)}
      src={BRAND_LOGO_SRC}
      {...props}
    />
  );
}

type BrandLockupProps = {
  crestSrc: string;
  crestAlt?: string;
  size?: "sm" | "lg";
  tagline?: string;
  crestClassName?: string;
  logoClassName?: string;
  className?: string;
};

function BrandLockup({
  crestSrc,
  crestAlt = "St. Aloysius' College crest",
  size = "sm",
  tagline,
  crestClassName,
  logoClassName,
  className,
}: BrandLockupProps) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-3", className)}>
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
        <Brand className={logoClassName} size={size} />
        {tagline ? (
          <span className="mt-[5px] font-mono text-[13px] tracking-[0.14em] text-muted-2">
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export { Brand, BrandLockup };
export type { BrandLockupProps, BrandProps };
