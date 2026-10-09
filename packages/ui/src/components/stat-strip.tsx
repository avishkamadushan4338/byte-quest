import { cn } from "@byte-quest/ui/lib/utils";
import type { ReactNode } from "react";

type StatValueTone = "default" | "teal" | "volt" | "lime" | "gold" | "mint";

const valueToneClasses = {
  default: "text-fg",
  teal: "text-teal",
  volt: "text-volt",
  lime: "text-lime",
  gold: "text-gold-bright",
  mint: "text-mint",
} satisfies Record<StatValueTone, string>;

type StatItem = {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  tone?: StatValueTone;
};

type StatStripProps = {
  items: StatItem[];
  columns?: string;
  className?: string;
  valueClassName?: string;
};

function StatStrip({
  items,
  columns = "minmax(min(100%,160px),1fr)",
  className,
  valueClassName,
}: StatStripProps) {
  return (
    <dl
      className={cn(
        "border-line-soft bg-ink/50 grid gap-px overflow-hidden rounded-lg border",
        className
      )}
      style={{ gridTemplateColumns: `repeat(auto-fit,${columns})` }}
    >
      {items.map((item) => (
        <div className="bg-ink/50 px-5 py-[18px]" key={String(item.label)}>
          <dt className="text-faint font-mono text-[12.5px] tracking-[0.14em] uppercase">
            {item.label}
          </dt>
          <dd
            className={cn(
              "font-display mt-2 text-[26px] font-bold tracking-[-0.02em]",
              valueToneClasses[item.tone ?? "default"],
              valueClassName
            )}
          >
            {item.value}
          </dd>
          {item.hint ? (
            <dd className="text-muted-2 mt-1 text-[13px] leading-[1.5]">
              {item.hint}
            </dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

type HairlineGridProps = {
  as?: "div" | "ul" | "ol";
  columns?: string;
  className?: string;
  children: ReactNode;
};

function HairlineGrid({
  as: Tag = "div",
  columns = "minmax(min(100%,240px),1fr)",
  className,
  children,
}: HairlineGridProps) {
  return (
    <Tag
      className={cn("bg-line-soft grid gap-px overflow-hidden rounded-[20px]", className)}
      style={{ gridTemplateColumns: `repeat(auto-fit,${columns})` }}
    >
      {children}
    </Tag>
  );
}

type HairlineCellProps = {
  className?: string;
  children: ReactNode;
};

function HairlineCell({ className, children }: HairlineCellProps) {
  return (
    <div className={cn("bg-surface flex flex-col gap-2.5 p-6", className)}>
      {children}
    </div>
  );
}

export { HairlineCell, HairlineGrid, StatStrip };
export type { StatItem, StatStripProps };