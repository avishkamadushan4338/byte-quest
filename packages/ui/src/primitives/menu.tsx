import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "@byte-quest/ui/lib/utils";

function MenuRoot(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root {...props} />;
}

function MenuTrigger({
  className,
  ...props
}: Omit<MenuPrimitive.Trigger.Props, "className"> & { className?: string }) {
  return <MenuPrimitive.Trigger className={className} {...props} />;
}

function MenuContent({
  align = "end",
  alignOffset = 8,
  side = "bottom",
  sideOffset = 8,
  className,
  ...props
}: Omit<MenuPrimitive.Popup.Props, "className"> & {
  className?: string;
} & Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50 outline-none"
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          className={cn(
            "min-w-56 origin-(--transform-origin) overflow-hidden rounded-xl border border-line-strong bg-surface p-1.5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] transition-[opacity,transform] duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function MenuGroup({
  className,
  ...props
}: Omit<MenuPrimitive.Group.Props, "className"> & { className?: string }) {
  return <MenuPrimitive.Group className={className} {...props} />;
}

function MenuGroupLabel({
  className,
  ...props
}: Omit<MenuPrimitive.GroupLabel.Props, "className"> & {
  className?: string;
}) {
  return (
    <MenuPrimitive.GroupLabel
      className={cn(
        "px-3 py-2 font-mono text-[12.5px] tracking-[0.16em] text-faint uppercase",
        className
      )}
      {...props}
    />
  );
}

function MenuItem({
  className,
  ...props
}: Omit<MenuPrimitive.Item.Props, "className"> & { className?: string }) {
  return (
    <MenuPrimitive.Item
      className={cn(
        "flex cursor-default items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-fg-dim outline-none transition-colors select-none hover:bg-volt/8 hover:text-fg focus:bg-volt/8 focus:text-fg data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

function MenuSeparator({
  className,
  ...props
}: Omit<MenuPrimitive.Separator.Props, "className"> & { className?: string }) {
  return (
    <MenuPrimitive.Separator
      className={cn("my-1 h-px bg-line-soft", className)}
      {...props}
    />
  );
}

export {
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
};
