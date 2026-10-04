import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@byte-quest/ui/lib/utils";

type InputProps = Omit<InputPrimitive.Props, "className"> & {
  className?: string;
};

const inputClasses =
  "h-12 w-full min-w-0 rounded-xl border border-line-strong bg-surface/70 px-4 text-base text-fg transition-colors outline-none placeholder:text-faint hover:border-line-strong/80 focus-visible:border-volt focus-visible:ring-1 focus-visible:ring-volt/40 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/30";

function Input({ className, ...props }: InputProps) {
  return <InputPrimitive className={cn(inputClasses, className)} {...props} />;
}

export { Input, inputClasses };
export type { InputProps };
