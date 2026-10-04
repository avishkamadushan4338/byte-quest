import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@byte-quest/ui/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm";

type ButtonProps = Omit<ButtonPrimitive.Props, "className" | "render"> & {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  render?: ButtonPrimitive.Props["render"];
};

const variantClasses = {
  primary:
    "bg-volt text-ink font-bold shadow-[0_10px_36px_-12px_rgba(82,255,61,0.65)] hover:bg-lime active:translate-y-px disabled:bg-volt/40",
  outline:
    "border border-line-fg bg-ink/40 text-fg font-semibold hover:border-volt hover:text-fg",
  ghost:
    "text-muted hover:bg-volt/8 hover:text-fg",
  link: "text-volt underline-offset-4 hover:underline",
} satisfies Record<ButtonVariant, string>;

const sizeClasses = {
  sm: "h-9 gap-1.5 px-4 text-[13px]",
  md: "h-11 gap-2 px-6 text-sm",
  lg: "h-[52px] gap-2.5 px-7 text-[15px]",
  icon: "size-10",
  "icon-sm": "size-9",
} satisfies Record<ButtonSize, string>;

function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: Pick<ButtonProps, "variant" | "size" | "className"> = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-full whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 aria-busy:opacity-70",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      className={buttonVariants({ variant, size, className })}
      type={type}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps, ButtonSize, ButtonVariant };
