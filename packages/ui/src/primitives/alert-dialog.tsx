import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { cn } from "@byte-quest/ui/lib/utils";
import type { ReactNode } from "react";

import { buttonVariants } from "@byte-quest/ui/primitives/button";

type AlertDialogRootProps = AlertDialogPrimitive.Root.Props;

function AlertDialogRoot(props: AlertDialogRootProps) {
  return <AlertDialogPrimitive.Root {...props} />;
}

type AlertDialogTriggerProps = Omit<
  AlertDialogPrimitive.Trigger.Props,
  "className"
> & {
  className?: string;
};

function AlertDialogTrigger({
  className,
  ...props
}: AlertDialogTriggerProps) {
  return (
    <AlertDialogPrimitive.Trigger
      className={cn("cursor-pointer", className)}
      {...props}
    />
  );
}

type AlertDialogPortalProps = AlertDialogPrimitive.Portal.Props;

function AlertDialogPortal(props: AlertDialogPortalProps) {
  return <AlertDialogPrimitive.Portal {...props} />;
}

type AlertDialogBackdropProps = Omit<
  AlertDialogPrimitive.Backdrop.Props,
  "className"
> & {
  className?: string;
};

function AlertDialogBackdrop({
  className,
  ...props
}: AlertDialogBackdropProps) {
  return (
    <AlertDialogPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-60 bg-ink/90 backdrop-blur-md transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

type AlertDialogViewportProps = Omit<
  AlertDialogPrimitive.Viewport.Props,
  "className"
> & {
  className?: string;
};

function AlertDialogViewport({
  className,
  ...props
}: AlertDialogViewportProps) {
  return (
    <AlertDialogPrimitive.Viewport
      className={cn(
        "fixed inset-0 z-70 flex items-center justify-center p-6 outline-none",
        className
      )}
      {...props}
    />
  );
}

type AlertDialogPopupProps = Omit<AlertDialogPrimitive.Popup.Props, "className"> & {
  className?: string;
};

function AlertDialogPopup({ className, ...props }: AlertDialogPopupProps) {
  return (
    <AlertDialogPrimitive.Popup
      className={cn(
        "border-line-strong bg-surface-2 max-h-[calc(100dvh-2rem)] w-full max-w-[440px] overflow-y-auto overscroll-contain rounded-3xl border p-[clamp(24px,3vw,32px)] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] transition-[transform,opacity] duration-200 outline-none data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

type AlertDialogTitleProps = Omit<
  AlertDialogPrimitive.Title.Props,
  "className"
> & {
  className?: string;
};

function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps) {
  return (
    <AlertDialogPrimitive.Title
      className={cn(
        "font-display mt-5 text-[24px] font-bold tracking-[-0.02em]",
        className
      )}
      {...props}
    />
  );
}

type AlertDialogDescriptionProps = Omit<
  AlertDialogPrimitive.Description.Props,
  "className"
> & {
  className?: string;
};

function AlertDialogDescription({
  className,
  ...props
}: AlertDialogDescriptionProps) {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-muted mt-2 text-[15px] leading-[1.6]", className)}
      {...props}
    />
  );
}

type AlertDialogCloseProps = Omit<
  AlertDialogPrimitive.Close.Props,
  "className"
> & {
  className?: string;
  children?: ReactNode;
  variant?: "primary" | "outline" | "ghost";
};

function AlertDialogClose({
  className,
  variant = "primary",
  children,
  ...props
}: AlertDialogCloseProps) {
  return (
    <AlertDialogPrimitive.Close
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    >
      {children}
    </AlertDialogPrimitive.Close>
  );
}

export {
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogViewport,
};
export type { AlertDialogRootProps, AlertDialogTriggerProps };