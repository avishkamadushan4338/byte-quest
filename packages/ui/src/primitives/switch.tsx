import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@byte-quest/ui/lib/utils";

type SwitchRootProps = Omit<SwitchPrimitive.Root.Props, "className"> & {
  className?: string;
};

const switchClasses =
  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-line-strong bg-surface-3 transition-colors outline-none hover:border-volt/50 data-checked:border-volt data-checked:bg-volt/25 data-disabled:pointer-events-none data-disabled:opacity-50";

const switchThumbClasses =
  "block size-4.5 translate-x-[3px] rounded-full bg-faint transition-[transform,background-color] duration-200 data-checked:translate-x-[23px] data-checked:bg-volt";

type SwitchThumbProps = Omit<SwitchPrimitive.Thumb.Props, "className"> & {
  className?: string;
};

function Switch({ className, ...props }: SwitchRootProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(switchClasses, className)}
      {...props}
    >
      <SwitchPrimitive.Thumb className={switchThumbClasses} />
    </SwitchPrimitive.Root>
  );
}

function SwitchThumb({ className, ...props }: SwitchThumbProps) {
  return (
    <SwitchPrimitive.Thumb className={cn(switchThumbClasses, className)} {...props} />
  );
}

export { Switch, SwitchThumb, switchClasses };
export type { SwitchRootProps };