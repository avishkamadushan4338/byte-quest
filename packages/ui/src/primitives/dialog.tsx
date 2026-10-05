import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "@byte-quest/ui/lib/utils";

function DialogRoot(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger({
  className,
  ...props
}: Omit<DialogPrimitive.Trigger.Props, "className"> & { className?: string }) {
  return <DialogPrimitive.Trigger className={className} {...props} />;
}

function DialogBackdrop({
  className,
  ...props
}: Omit<DialogPrimitive.Backdrop.Props, "className"> & { className?: string }) {
  return (
    <DialogPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-60 bg-ink/95 backdrop-blur-xl transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  backdropClassName,
  viewportClassName,
  ...props
}: Omit<DialogPrimitive.Popup.Props, "className"> & {
  className?: string;
  backdropClassName?: string;
  viewportClassName?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogBackdrop className={backdropClassName} />
      <DialogPrimitive.Viewport
        className={cn("fixed inset-0 z-70 flex flex-col outline-none", viewportClassName)}
      >
        <DialogPrimitive.Popup
          className={cn(
            "flex h-full w-full flex-col p-6 outline-none sm:p-8",
            className
          )}
          {...props}
        />
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}

function DialogTitle({
  className,
  ...props
}: Omit<DialogPrimitive.Title.Props, "className"> & { className?: string }) {
  return (
    <DialogPrimitive.Title
      className={cn("font-mono text-[11px] tracking-[0.16em] text-muted-2 uppercase", className)}
      {...props}
    />
  );
}

function DialogClose({
  className,
  ...props
}: Omit<DialogPrimitive.Close.Props, "className"> & { className?: string }) {
  return (
    <DialogPrimitive.Close
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-fg transition-colors hover:border-volt hover:text-volt",
        className
      )}
      {...props}
    />
  );
}

export {
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
};
