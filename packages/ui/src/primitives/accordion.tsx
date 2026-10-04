import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "@byte-quest/ui/lib/utils";
import type { ReactNode } from "react";

import { ChevronDown } from "@byte-quest/ui/components/icons";

type AccordionRootProps<Value> = Omit<
  AccordionPrimitive.Root.Props<Value>,
  "className"
> & {
  className?: string;
};

function AccordionRoot<Value>({ className, ...props }: AccordionRootProps<Value>) {
  return (
    <AccordionPrimitive.Root
      className={cn("border-line-soft divide-line-soft divide-y border", className)}
      {...props}
    />
  );
}

type AccordionItemProps = Omit<AccordionPrimitive.Item.Props, "className"> & {
  className?: string;
};

function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      className={cn("group", className)}
      {...props}
    />
  );
}

type AccordionHeaderProps = Omit<
  AccordionPrimitive.Header.Props,
  "className"
> & {
  className?: string;
};

function AccordionHeader({ className, ...props }: AccordionHeaderProps) {
  return (
    <AccordionPrimitive.Header className={cn("flex", className)} {...props} />
  );
}

type AccordionTriggerProps = Omit<
  AccordionPrimitive.Trigger.Props,
  "className"
> & {
  className?: string;
  children?: ReactNode;
};

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Trigger
      className={cn(
        "text-fg hover:text-volt flex flex-1 cursor-pointer items-center justify-between gap-4 py-5 text-left font-display text-[17px] font-semibold transition-colors outline-none",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="text-faint size-4 shrink-0 transition-transform duration-200 group-data-[panel-open]:rotate-180" />
    </AccordionPrimitive.Trigger>
  );
}

type AccordionPanelProps = Omit<
  AccordionPrimitive.Panel.Props,
  "className"
> & {
  className?: string;
};

function AccordionPanel({ className, ...props }: AccordionPanelProps) {
  return (
    <AccordionPrimitive.Panel
      className={cn(
        "text-muted-2 overflow-hidden text-[14.5px] leading-[1.65] transition-[grid-template-rows,opacity] duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

export {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
};
export type { AccordionItemProps, AccordionRootProps };