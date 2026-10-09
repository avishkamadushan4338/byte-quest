import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "@byte-quest/ui/lib/utils";
import type { ReactNode } from "react";

import { Check, ChevronDown, ChevronUp } from "@byte-quest/ui/components/icons";
import { inputClasses } from "@byte-quest/ui/primitives/input";

type SelectRootProps<Value, Multiple extends boolean | undefined> = SelectPrimitive.Root.Props<
  Value,
  Multiple
>;

function SelectRoot<Value, Multiple extends boolean | undefined = false>(
  props: SelectRootProps<Value, Multiple>
) {
  return <SelectPrimitive.Root {...props} />;
}

type SelectTriggerProps = Omit<SelectPrimitive.Trigger.Props, "className"> & {
  className?: string;
};

function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        inputClasses,
        "flex cursor-pointer items-center justify-between gap-2 text-left data-placeholder:text-faint",
        className
      )}
      {...props}
    >
      {children}
    </SelectPrimitive.Trigger>
  );
}

type SelectValueProps = Omit<SelectPrimitive.Value.Props, "className"> & {
  className?: string;
};

function SelectValue({ className, ...props }: SelectValueProps) {
  return (
    <SelectPrimitive.Value
      className={cn("truncate text-fg", className)}
      {...props}
    />
  );
}

type SelectIconProps = Omit<SelectPrimitive.Icon.Props, "className"> & {
  className?: string;
  children?: ReactNode;
};

function SelectIcon({ className, children, ...props }: SelectIconProps) {
  return (
    <SelectPrimitive.Icon
      className={cn(
        "text-muted-2 flex size-5 items-center justify-center transition-transform duration-200",
        className
      )}
      {...props}
    >
      {children ?? <ChevronDown />}
    </SelectPrimitive.Icon>
  );
}

type SelectPortalProps = SelectPrimitive.Portal.Props;

function SelectPortal(props: SelectPortalProps) {
  return <SelectPrimitive.Portal {...props} />;
}

type SelectPositionerProps = Omit<
  SelectPrimitive.Positioner.Props,
  "className"
> & {
  className?: string;
};

function SelectPositioner({ className, ...props }: SelectPositionerProps) {
  return (
    <SelectPrimitive.Positioner
      className={cn("z-80", className)}
      {...props}
    />
  );
}

type SelectPopupProps = Omit<SelectPrimitive.Popup.Props, "className"> & {
  className?: string;
};

function SelectPopup({ className, ...props }: SelectPopupProps) {
  return (
    <SelectPrimitive.Popup
      className={cn(
        "border-line-strong bg-surface-2 origin-top rounded-2xl border p-1.5 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.85)] transition-[transform,opacity] duration-150 outline-none data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

type SelectListProps = Omit<SelectPrimitive.List.Props, "className"> & {
  className?: string;
};

function SelectList({ className, ...props }: SelectListProps) {
  return (
    <SelectPrimitive.List
      className={cn(
        "max-h-[min(20rem,var(--available-height))] scroll-py-1 overflow-y-auto overscroll-contain",
        className
      )}
      {...props}
    />
  );
}

type SelectItemProps = Omit<SelectPrimitive.Item.Props, "className"> & {
  className?: string;
};

function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "text-muted flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors outline-none data-disabled:pointer-events-none data-disabled:opacity-40 data-highlighted:bg-volt/12 data-highlighted:text-fg",
        className
      )}
      {...props}
    >
      <span className="flex-1 truncate">
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </span>
      <SelectPrimitive.ItemIndicator className="text-volt flex items-center">
        <Check className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

type SelectGroupProps = SelectPrimitive.Group.Props;

function SelectGroup(props: SelectGroupProps) {
  return <SelectPrimitive.Group {...props} />;
}

type SelectGroupLabelProps = Omit<
  SelectPrimitive.GroupLabel.Props,
  "className"
> & {
  className?: string;
};

function SelectGroupLabel({ className, ...props }: SelectGroupLabelProps) {
  return (
    <SelectPrimitive.GroupLabel
      className={cn(
        "text-faint px-3 pt-2 pb-1 font-mono text-[12.5px] tracking-[0.14em] uppercase",
        className
      )}
      {...props}
    />
  );
}

type SelectSeparatorProps = Omit<SelectPrimitive.Separator.Props, "className"> & {
  className?: string;
};

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <SelectPrimitive.Separator
      className={cn("bg-line my-1 h-px", className)}
      {...props}
    />
  );
}

type SelectScrollProps = Omit<
  SelectPrimitive.ScrollUpArrow.Props | SelectPrimitive.ScrollDownArrow.Props,
  "className"
> & {
  className?: string;
};

function SelectScrollUp({ className, ...props }: SelectScrollProps) {
  return (
    <SelectPrimitive.ScrollUpArrow
      className={cn(
        "text-faint flex h-6 items-center justify-center transition-colors data-[hovering]:text-fg",
        className
      )}
      {...props}
    >
      <ChevronUp className="size-3.5" />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDown({ className, ...props }: SelectScrollProps) {
  return (
    <SelectPrimitive.ScrollDownArrow
      className={cn(
        "text-faint flex h-6 items-center justify-center transition-colors data-[hovering]:text-fg",
        className
      )}
      {...props}
    >
      <ChevronDown className="size-3.5" />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  SelectGroup,
  SelectGroupLabel,
  SelectIcon,
  SelectItem,
  SelectList,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectRoot,
  SelectScrollDown,
  SelectScrollUp,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
export type { SelectRootProps, SelectTriggerProps, SelectValueProps };