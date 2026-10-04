import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { cn } from "@byte-quest/ui/lib/utils";
import type { ReactNode } from "react";

import { Check, ChevronDown, Close } from "@byte-quest/ui/components/icons";

type ComboboxRootProps<
  Value,
  Multiple extends boolean | undefined,
  Item,
> = ComboboxPrimitive.Root.Props<Value, Multiple, Item>;

function ComboboxRoot<
  Value,
  Multiple extends boolean | undefined = false,
  Item = Value,
>(props: ComboboxRootProps<Value, Multiple, Item>) {
  return <ComboboxPrimitive.Root {...props} />;
}

type ComboboxInputProps = Omit<ComboboxPrimitive.Input.Props, "className"> & {
  className?: string;
};

function ComboboxInput({ className, ...props }: ComboboxInputProps) {
  return (
    <ComboboxPrimitive.Input
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-line-strong bg-surface/70 px-4 pr-10 text-base text-fg transition-colors outline-none placeholder:text-faint hover:border-line-strong/80 focus-visible:border-volt focus-visible:ring-1 focus-visible:ring-volt/40 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

type ComboboxTriggerProps = Omit<ComboboxPrimitive.Trigger.Props, "className"> & {
  className?: string;
};

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxTriggerProps) {
  return (
    <ComboboxPrimitive.Trigger
      className={cn(
        "absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center rounded-r-xl text-muted-2 transition-colors hover:text-fg",
        className
      )}
      {...props}
    >
      {children ?? <ChevronDown className="size-4" />}
    </ComboboxPrimitive.Trigger>
  );
}

type ComboboxIconProps = Omit<ComboboxPrimitive.Icon.Props, "className"> & {
  className?: string;
  children?: ReactNode;
};

function ComboboxIcon({ className, children, ...props }: ComboboxIconProps) {
  return (
    <ComboboxPrimitive.Icon
      className={cn(
        "text-muted-2 flex size-5 items-center justify-center transition-transform duration-200",
        className
      )}
      {...props}
    >
      {children ?? <ChevronDown />}
    </ComboboxPrimitive.Icon>
  );
}

type ComboboxPortalProps = ComboboxPrimitive.Portal.Props;

function ComboboxPortal(props: ComboboxPortalProps) {
  return <ComboboxPrimitive.Portal {...props} />;
}

type ComboboxPositionerProps = Omit<
  ComboboxPrimitive.Positioner.Props,
  "className"
> & {
  className?: string;
};

function ComboboxPositioner({
  className,
  ...props
}: ComboboxPositionerProps) {
  return (
    <ComboboxPrimitive.Positioner
      className={cn("z-80", className)}
      {...props}
    />
  );
}

type ComboboxPopupProps = Omit<ComboboxPrimitive.Popup.Props, "className"> & {
  className?: string;
};

function ComboboxPopup({ className, ...props }: ComboboxPopupProps) {
  return (
    <ComboboxPrimitive.Popup
      className={cn(
        "border-line-strong bg-surface-2 origin-top rounded-2xl border p-1.5 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.85)] transition-[transform,opacity] duration-150 outline-none data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

type ComboboxListProps = Omit<ComboboxPrimitive.List.Props, "className"> & {
  className?: string;
};

function ComboboxList({ className, ...props }: ComboboxListProps) {
  return (
    <ComboboxPrimitive.List
      className={cn(
        "max-h-[min(18rem,var(--available-height))] scroll-py-1 overflow-y-auto overscroll-contain",
        className
      )}
      {...props}
    />
  );
}

type ComboboxItemProps = Omit<ComboboxPrimitive.Item.Props, "className"> & {
  className?: string;
};

function ComboboxItem({ className, children, ...props }: ComboboxItemProps) {
  return (
    <ComboboxPrimitive.Item
      className={cn(
        "text-muted flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors outline-none data-disabled:pointer-events-none data-disabled:opacity-40 data-highlighted:bg-volt/12 data-highlighted:text-fg",
        className
      )}
      {...props}
    >
      <span className="flex-1 truncate">{children}</span>
      <ComboboxPrimitive.ItemIndicator className="text-volt flex items-center">
        <Check className="size-4" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

type ComboboxEmptyProps = Omit<ComboboxPrimitive.Empty.Props, "className"> & {
  className?: string;
};

function ComboboxEmpty({ className, ...props }: ComboboxEmptyProps) {
  return (
    <ComboboxPrimitive.Empty
      className={cn(
        "text-faint px-3 py-6 text-center font-mono text-[11px] tracking-[0.14em] uppercase",
        className
      )}
      {...props}
    />
  );
}

type ComboboxGroupProps = ComboboxPrimitive.Group.Props;

function ComboboxGroup(props: ComboboxGroupProps) {
  return <ComboboxPrimitive.Group {...props} />;
}

type ComboboxGroupLabelProps = Omit<
  ComboboxPrimitive.GroupLabel.Props,
  "className"
> & {
  className?: string;
};

function ComboboxGroupLabel({
  className,
  ...props
}: ComboboxGroupLabelProps) {
  return (
    <ComboboxPrimitive.GroupLabel
      className={cn(
        "text-faint px-3 pt-2 pb-1 font-mono text-[10.5px] tracking-[0.14em] uppercase",
        className
      )}
      {...props}
    />
  );
}

type ComboboxSeparatorProps = Omit<
  ComboboxPrimitive.Separator.Props,
  "className"
> & {
  className?: string;
};

function ComboboxSeparator({ className, ...props }: ComboboxSeparatorProps) {
  return (
    <ComboboxPrimitive.Separator
      className={cn("bg-line my-1 h-px", className)}
      {...props}
    />
  );
}

type ComboboxClearProps = Omit<ComboboxPrimitive.Clear.Props, "className"> & {
  className?: string;
};

function ComboboxClear({ className, ...props }: ComboboxClearProps) {
  return (
    <ComboboxPrimitive.Clear
      aria-label="Clear selection"
      className={cn(
        "text-faint absolute inset-y-0 left-0 flex w-10 cursor-pointer items-center justify-center transition-colors hover:text-fg",
        className
      )}
      {...props}
    >
      <Close className="size-3.5" />
    </ComboboxPrimitive.Clear>
  );
}

export {
  ComboboxClear,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxIcon,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxTrigger,
};
export type {
  ComboboxInputProps,
  ComboboxRootProps,
  ComboboxTriggerProps,
};