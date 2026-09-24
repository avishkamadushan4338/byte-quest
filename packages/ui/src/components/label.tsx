import type { ComponentProps } from "react";
import { cn } from "@byte-quest/ui/lib/utils";

function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 text-xs leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Label };
