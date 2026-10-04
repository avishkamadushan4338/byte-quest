import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@byte-quest/ui/lib/utils";

type PopoverRootProps = PopoverPrimitive.Root.Props;

function PopoverRoot(props: PopoverRootProps) {
  return <PopoverPrimitive.Root {...props} />;
}

type PopoverTriggerProps = Omit<
  PopoverPrimitive.Trigger.Props,
  "className"
> & {
  className?: string;
};

function PopoverTrigger({ className, ...props }: PopoverTriggerProps) {
  return (
    <PopoverPrimitive.Trigger
      className={cn("cursor-pointer outline-none", className)}
      {...props}
    />
  );
}

type PopoverPortalProps = PopoverPrimitive.Portal.Props;

function PopoverPortal(props: PopoverPortalProps) {
  return <PopoverPrimitive.Portal {...props} />;
}

type PopoverPositionerProps = Omit<
  PopoverPrimitive.Positioner.Props,
  "className"
> & {
  className?: string;
};

function PopoverPositioner({ className, ...props }: PopoverPositionerProps) {
  return (
    <PopoverPrimitive.Positioner
      className={cn("z-80", className)}
      {...props}
    />
  );
}

type PopoverPopupProps = Omit<PopoverPrimitive.Popup.Props, "className"> & {
  className?: string;
};

function PopoverPopup({ className, ...props }: PopoverPopupProps) {
  return (
    <PopoverPrimitive.Popup
      className={cn(
        "border-line-strong bg-surface-2 origin-top rounded-2xl border p-4 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.85)] transition-[transform,opacity] duration-150 outline-none data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

type PopoverTitleProps = Omit<PopoverPrimitive.Title.Props, "className"> & {
  className?: string;
};

function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <PopoverPrimitive.Title
      className={cn("font-display text-fg text-[15px] font-semibold", className)}
      {...props}
    />
  );
}

type PopoverDescriptionProps = Omit<
  PopoverPrimitive.Description.Props,
  "className"
> & {
  className?: string;
};

function PopoverDescription({ className, ...props }: PopoverDescriptionProps) {
  return (
    <PopoverPrimitive.Description
      className={cn("text-muted-2 mt-1 text-[13px] leading-[1.5]", className)}
      {...props}
    />
  );
}

type PopoverCloseProps = Omit<PopoverPrimitive.Close.Props, "className"> & {
  className?: string;
};

function PopoverClose({ className, ...props }: PopoverCloseProps) {
  return (
    <PopoverPrimitive.Close
      className={cn("cursor-pointer outline-none", className)}
      {...props}
    />
  );
}

export {
  PopoverClose,
  PopoverDescription,
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
};
export type { PopoverRootProps, PopoverTriggerProps };