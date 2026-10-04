import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@byte-quest/ui/lib/utils";

type TooltipRootProps = TooltipPrimitive.Root.Props;

function TooltipProvider({
  delay = 250,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider delay={delay} {...props} />;
}

function TooltipRoot(props: TooltipRootProps) {
  return <TooltipPrimitive.Root {...props} />;
}

type TooltipTriggerProps = Omit<
  TooltipPrimitive.Trigger.Props,
  "className"
> & {
  className?: string;
};

function TooltipTrigger({ className, ...props }: TooltipTriggerProps) {
  return (
    <TooltipPrimitive.Trigger
      className={cn("cursor-default", className)}
      {...props}
    />
  );
}

type TooltipPortalProps = TooltipPrimitive.Portal.Props;

function TooltipPortal(props: TooltipPortalProps) {
  return <TooltipPrimitive.Portal {...props} />;
}

type TooltipPositionerProps = Omit<
  TooltipPrimitive.Positioner.Props,
  "className"
> & {
  className?: string;
};

function TooltipPositioner({ className, ...props }: TooltipPositionerProps) {
  return (
    <TooltipPrimitive.Positioner className={cn("z-90", className)} {...props} />
  );
}

type TooltipPopupProps = Omit<TooltipPrimitive.Popup.Props, "className"> & {
  className?: string;
};

function TooltipPopup({ className, ...props }: TooltipPopupProps) {
  return (
    <TooltipPrimitive.Popup
      className={cn(
        "border-line-strong bg-surface-2 text-muted max-w-64 rounded-xl border px-3 py-2 text-[13px] leading-[1.5] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)] transition-opacity duration-150 data-[ending-style]:opacity-0 data-[instant]:duration-0 data-[starting-style]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

type TooltipArrowProps = Omit<TooltipPrimitive.Arrow.Props, "className"> & {
  className?: string;
};

function TooltipArrow({ className, ...props }: TooltipArrowProps) {
  return (
    <TooltipPrimitive.Arrow
      className={cn("text-surface-2", className)}
      {...props}
    />
  );
}

export {
  TooltipArrow,
  TooltipPopup,
  TooltipPortal,
  TooltipPositioner,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
};
export type { TooltipRootProps, TooltipTriggerProps };