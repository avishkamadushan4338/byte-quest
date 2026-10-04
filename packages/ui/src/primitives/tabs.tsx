import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@byte-quest/ui/lib/utils";

const tabsListClasses =
  "bg-surface border-line-soft inline-flex w-fit flex-wrap items-center gap-1 rounded-[14px] border p-1.5";

const tabsTabClasses =
  "text-muted hover:text-fg cursor-pointer rounded-[9px] px-3.5 py-2 font-mono text-[11.5px] tracking-[0.06em] whitespace-nowrap uppercase transition-colors outline-none data-selected:bg-fg data-selected:text-ink";

type TabsRootProps = Omit<TabsPrimitive.Root.Props, "className"> & {
  className?: string;
};

function TabsRoot({ className, ...props }: TabsRootProps) {
  return <TabsPrimitive.Root className={cn("grid gap-6", className)} {...props} />;
}

type TabsListProps = Omit<TabsPrimitive.List.Props, "className"> & {
  className?: string;
};

function TabsList({ className, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List className={cn(tabsListClasses, className)} {...props} />
  );
}

type TabsTabProps = Omit<TabsPrimitive.Tab.Props, "className"> & {
  className?: string;
};

function TabsTab({ className, ...props }: TabsTabProps) {
  return (
    <TabsPrimitive.Tab className={cn(tabsTabClasses, className)} {...props} />
  );
}

type TabsPanelProps = Omit<TabsPrimitive.Panel.Props, "className"> & {
  className?: string;
};

function TabsPanel({ className, ...props }: TabsPanelProps) {
  return (
    <TabsPrimitive.Panel
      className={cn("outline-none", className)}
      {...props}
    />
  );
}

type TabsIndicatorProps = Omit<TabsPrimitive.Indicator.Props, "className"> & {
  className?: string;
};

function TabsIndicator({ className, ...props }: TabsIndicatorProps) {
  return (
    <TabsPrimitive.Indicator
      className={cn(
        "bg-fg absolute top-1.5 bottom-1.5 -z-10 rounded-[9px] transition-[left,width] duration-200",
        className
      )}
      {...props}
    />
  );
}

export {
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
  tabsListClasses,
  tabsTabClasses,
};
export type { TabsRootProps };