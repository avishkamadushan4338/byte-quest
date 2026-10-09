import { cn } from "@byte-quest/ui/lib/utils";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  kicker: string;
  title: ReactNode;
  kickerClassName?: string;
  className?: string;
}

export const SectionHeading = ({
  kicker,
  title,
  kickerClassName,
  className,
}: SectionHeadingProps) => (
  <>
    <div
      className={cn(
        "text-teal font-mono text-[13px] tracking-[0.16em]",
        kickerClassName
      )}
    >
      {kicker}
    </div>
    <h2
      className={cn(
        "mt-[18px] mb-0 text-[clamp(34px,4.4vw,60px)] leading-[0.95] tracking-[-0.04em]",
        className
      )}
    >
      {title}
    </h2>
  </>
);
