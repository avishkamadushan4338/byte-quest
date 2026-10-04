import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cn } from "@byte-quest/ui/lib/utils";

import { Check, Minus } from "@byte-quest/ui/components/icons";

type CheckboxRootProps = Omit<CheckboxPrimitive.Root.Props, "className"> & {
  className?: string;
};

const checkboxClasses =
  "flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-md border border-line-strong bg-ink text-ink transition-colors outline-none hover:border-volt/60 data-checked:border-volt data-checked:bg-volt data-indeterminate:border-volt data-indeterminate:bg-volt data-disabled:pointer-events-none data-disabled:opacity-50";

function Checkbox({ className, ...props }: CheckboxRootProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn(checkboxClasses, className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <Check className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

type CheckboxIndicatorProps = Omit<
  CheckboxPrimitive.Indicator.Props,
  "className"
> & {
  className?: string;
};

function CheckboxIndicator({ className, ...props }: CheckboxIndicatorProps) {
  return (
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center", className)}
      {...props}
    />
  );
}

type CheckboxIndeterminateProps = CheckboxIndicatorProps;

function CheckboxIndeterminate({
  className,
  ...props
}: CheckboxIndeterminateProps) {
  return (
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Minus className="size-3.5" />
    </CheckboxPrimitive.Indicator>
  );
}

export {
  Checkbox,
  CheckboxIndicator,
  CheckboxIndeterminate,
  checkboxClasses,
};
export type { CheckboxRootProps };