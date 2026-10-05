import { cn } from "@byte-quest/ui/lib/utils";
import type { ReactNode } from "react";

interface HomeHeadingProps {
  kicker: string;
  title: ReactNode;
  lead: string;
  kickerColor?: string;
  leadClassName?: string;
}

export const HomeHeading = ({
  kicker,
  title,
  lead,
  kickerColor = "#00A99A",
  leadClassName = "max-w-[520px]",
}: HomeHeadingProps) => (
  <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-[72px] gap-y-6">
    <div>
      <div
        className="font-mono text-[11px] tracking-[0.16em]"
        style={{ color: kickerColor }}
      >
        {kicker}
      </div>
      <h2 className="mt-[18px] mb-0 text-[clamp(38px,5vw,68px)] leading-[0.95] tracking-[-0.04em]">
        {title}
      </h2>
    </div>
    <p
      className={cn(
        "text-muted m-0 text-[17px] text-pretty",
        leadClassName,
        "leading-[1.65]"
      )}
    >
      {lead}
    </p>
  </div>
);
