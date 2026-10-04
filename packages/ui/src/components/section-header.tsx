import type { ReactNode } from "react";
import { cn } from "@byte-quest/ui/lib/utils";

import { Kicker, type KickerTone } from "./kicker";

type SectionHeaderProps = {
  kicker: ReactNode;
  kickerTone?: KickerTone;
  title: ReactNode;
  lead?: ReactNode;
  align?: "split" | "center";
  className?: string;
};

function SectionHeader({
  kicker,
  kickerTone = "teal",
  title,
  lead,
  align = "split",
  className,
}: SectionHeaderProps) {
  if (align === "center") {
    return (
      <header className={cn("text-center", className)}>
        <Kicker tone={kickerTone}>{kicker}</Kicker>
        <h2 className="mt-[18px] text-[clamp(38px,5vw,68px)] leading-[0.95] tracking-[-0.04em]">
          {title}
        </h2>
        {lead ? (
          <p className="mx-auto mt-5 max-w-[520px] text-[17px] leading-[1.65] text-muted">
            {lead}
          </p>
        ) : null}
      </header>
    );
  }

  return (
    <header
      className={cn(
        "grid items-end gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))] lg:gap-x-[72px]",
        className
      )}
    >
      <div>
        <Kicker tone={kickerTone}>{kicker}</Kicker>
        <h2 className="mt-[18px] text-[clamp(38px,5vw,68px)] leading-[0.95] tracking-[-0.04em]">
          {title}
        </h2>
      </div>
      {lead ? (
        <p className="m-0 max-w-[520px] text-[17px] leading-[1.65] text-muted">
          {lead}
        </p>
      ) : null}
    </header>
  );
}

export { SectionHeader };
export type { SectionHeaderProps };
