import type { ReactNode } from "react";
import { cn } from "@byte-quest/ui/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
};

function Marquee({ children, className }: MarqueeProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden [-webkit-mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]",
        className
      )}
    >
      <div className="animate-marquee flex w-max">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

export { Marquee };
export type { MarqueeProps };
