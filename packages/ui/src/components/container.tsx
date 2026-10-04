import type { HTMLAttributes } from "react";
import { cn } from "@byte-quest/ui/lib/utils";

type ContainerProps = HTMLAttributes<HTMLDivElement>;

function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1280px]", className)}
      {...props}
    />
  );
}

export { Container };
export type { ContainerProps };
