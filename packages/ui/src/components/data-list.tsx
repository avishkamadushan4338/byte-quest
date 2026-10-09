import { cn } from "@byte-quest/ui/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type DataListProps = HTMLAttributes<HTMLDListElement> & {
  columns?: string;
  children: ReactNode;
};

function DataList({ columns, className, children, ...props }: DataListProps) {
  return (
    <dl
      className={cn("grid gap-px", className)}
      style={
        columns
          ? { gridTemplateColumns: `repeat(auto-fit,${columns})` }
          : undefined
      }
      {...props}
    >
      {children}
    </dl>
  );
}

type DataItemProps = HTMLAttributes<HTMLDivElement> & {
  label: ReactNode;
  value: ReactNode;
  valueClassName?: string;
};

function DataItem({
  label,
  value,
  className,
  valueClassName,
  ...props
}: DataItemProps) {
  const isEmpty = value === null || value === undefined || value === "";

  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      <dt className="text-faint font-mono text-[12.5px] tracking-[0.14em] uppercase">
        {label}
      </dt>
      <dd
        className={cn(
          "text-fg-strong text-[15px] leading-[1.5]",
          isEmpty && "text-faint-2",
          valueClassName
        )}
      >
        {isEmpty ? "-" : value}
      </dd>
    </div>
  );
}

export { DataItem, DataList };
export type { DataItemProps };