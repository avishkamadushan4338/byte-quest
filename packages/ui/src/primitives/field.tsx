import { Field as FieldPrimitive } from "@base-ui/react/field";
import { cn } from "@byte-quest/ui/lib/utils";

type FieldProps = Omit<FieldPrimitive.Root.Props, "className"> & {
  className?: string;
};

function Field({ className, ...props }: FieldProps) {
  return (
    <FieldPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: Omit<FieldPrimitive.Label.Props, "className"> & { className?: string }) {
  return (
    <FieldPrimitive.Label
      className={cn(
        "font-mono text-[13px] tracking-[0.16em] text-muted-2 uppercase",
        className
      )}
      {...props}
    />
  );
}

function FieldError({
  className,
  ...props
}: Omit<FieldPrimitive.Error.Props, "className"> & { className?: string }) {
  return (
    <FieldPrimitive.Error
      className={cn("text-[13px] text-gold-bright", className)}
      {...props}
    />
  );
}

function FieldDescription({
  className,
  ...props
}: Omit<FieldPrimitive.Description.Props, "className"> & {
  className?: string;
}) {
  return (
    <FieldPrimitive.Description
      className={cn("text-[13px] text-muted-2", className)}
      {...props}
    />
  );
}

export { Field, FieldDescription, FieldError, FieldLabel };
