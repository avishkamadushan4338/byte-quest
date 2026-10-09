import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cn } from "@byte-quest/ui/lib/utils";
import type { ReactNode } from "react";

const trackClasses =
  "bg-line-soft relative h-1 w-full overflow-hidden rounded-full";

const indicatorClasses =
  "h-full rounded-full bg-[linear-gradient(90deg,#00a99a,#52ff3d)] transition-[width] duration-350 ease-out";

type ProgressRootProps = Omit<ProgressPrimitive.Root.Props, "className"> & {
  className?: string;
};

function ProgressRoot({ className, ...props }: ProgressRootProps) {
  return (
    <ProgressPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
    />
  );
}

type ProgressTrackProps = Omit<ProgressPrimitive.Track.Props, "className"> & {
  className?: string;
};

function ProgressTrack({ className, ...props }: ProgressTrackProps) {
  return (
    <ProgressPrimitive.Track className={cn(trackClasses, className)} {...props} />
  );
}

type ProgressIndicatorProps = Omit<
  ProgressPrimitive.Indicator.Props,
  "className"
> & {
  className?: string;
};

function ProgressIndicator({
  className,
  ...props
}: ProgressIndicatorProps) {
  return (
    <ProgressPrimitive.Indicator
      className={cn(indicatorClasses, className)}
      {...props}
    />
  );
}

type ProgressLabelProps = Omit<ProgressPrimitive.Label.Props, "className"> & {
  className?: string;
  children?: ReactNode;
};

function ProgressLabel({ className, children, ...props }: ProgressLabelProps) {
  return (
    <ProgressPrimitive.Label
      className={cn(
        "text-muted-2 font-mono text-[12.5px] tracking-[0.14em] uppercase",
        className
      )}
      {...props}
    >
      {children}
    </ProgressPrimitive.Label>
  );
}

export {
  ProgressIndicator,
  ProgressLabel,
  ProgressRoot,
  ProgressTrack,
  indicatorClasses,
  trackClasses,
};
export type { ProgressRootProps };