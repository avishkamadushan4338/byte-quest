import type { HTMLAttributes } from "react";

import { cn } from "@byte-quest/ui/lib/utils";

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("bg-surface-2 animate-pulse rounded-xl", className)}
      {...props}
    />
  );
}

export { Skeleton };
export type { SkeletonProps };