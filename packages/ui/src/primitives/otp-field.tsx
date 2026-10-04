import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field";
import { cn } from "@byte-quest/ui/lib/utils";

type OtpFieldRootProps = Omit<OTPFieldPrimitive.Root.Props, "className"> & {
  className?: string;
};

function OtpField({ className, ...props }: OtpFieldRootProps) {
  return (
    <OTPFieldPrimitive.Root
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

type OtpFieldInputProps = Omit<OTPFieldPrimitive.Input.Props, "className"> & {
  className?: string;
};

function OtpFieldInput({ className, ...props }: OtpFieldInputProps) {
  return (
    <OTPFieldPrimitive.Input
      className={cn(
        "h-14 w-full min-w-0 rounded-xl border border-line-strong bg-surface/70 text-center font-mono text-lg text-fg transition-colors outline-none focus-visible:border-volt focus-visible:ring-1 focus-visible:ring-volt/40",
        className
      )}
      {...props}
    />
  );
}

export { OtpField, OtpFieldInput };
export type { OtpFieldRootProps };