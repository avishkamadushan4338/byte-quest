import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cn } from "@byte-quest/ui/lib/utils";
import type { ReactNode } from "react";

const radioClasses =
  "flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-ink text-ink transition-colors outline-none hover:border-volt/60 data-checked:border-volt data-disabled:pointer-events-none data-disabled:opacity-50";

const radioDotClasses =
  "size-2.5 rounded-full bg-volt scale-0 transition-transform duration-150 data-checked:scale-100";

type RadioGroupProps<Value> = Omit<
  RadioGroupPrimitive.Props<Value>,
  "className"
> & {
  className?: string;
};

function RadioGroup<Value>({ className, ...props }: RadioGroupProps<Value>) {
  return (
    <RadioGroupPrimitive
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

type RadioRootProps<Value> = Omit<RadioPrimitive.Root.Props<Value>, "className"> & {
  className?: string;
};

function Radio<Value>({ className, children, ...props }: RadioRootProps<Value>) {
  return (
    <RadioPrimitive.Root
      className={cn(radioClasses, className)}
      {...props}
    >
      <RadioPrimitive.Indicator className={cn("flex items-center justify-center")}>
        <span className={radioDotClasses} />
      </RadioPrimitive.Indicator>
      {children}
    </RadioPrimitive.Root>
  );
}

type RadioIndicatorProps = Omit<
  RadioPrimitive.Indicator.Props,
  "className"
> & {
  className?: string;
  children?: ReactNode;
};

function RadioIndicator({ className, children, ...props }: RadioIndicatorProps) {
  return (
    <RadioPrimitive.Indicator
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      {children ?? <span className={radioDotClasses} />}
    </RadioPrimitive.Indicator>
  );
}

export { Radio, RadioGroup, RadioIndicator, radioClasses };
export type { RadioGroupProps, RadioRootProps };