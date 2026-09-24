import type { ComponentProps } from "react";
import { cn } from "@byte-quest/ui/lib/utils";

function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("animate-pulse bg-muted", className)} {...props} />;
}

export { Skeleton };
