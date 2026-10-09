import { cn } from "@byte-quest/ui/lib/utils";
import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";

type TableWrapperProps = HTMLAttributes<HTMLDivElement>;

function TableWrapper({ className, ...props }: TableWrapperProps) {
  return (
    <div
      className={cn(
        "border-line-soft overflow-x-auto rounded-[20px] border",
        className
      )}
      {...props}
    />
  );
}

type TableProps = HTMLAttributes<HTMLTableElement>;

function Table({ className, ...props }: TableProps) {
  return (
    <table className={cn("w-full border-collapse", className)} {...props} />
  );
}

type TableHeadProps = HTMLAttributes<HTMLTableSectionElement>;

function TableHead({ className, ...props }: TableHeadProps) {
  return <thead className={cn("bg-surface-2", className)} {...props} />;
}

type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={cn("bg-surface", className)} {...props} />;
}

type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      className={cn("border-line-soft border-t transition-colors hover:bg-volt/4", className)}
      {...props}
    />
  );
}

type TableHeadCellProps = ThHTMLAttributes<HTMLTableCellElement>;

function TableHeadCell({ className, ...props }: TableHeadCellProps) {
  return (
    <th
      className={cn(
        "text-faint px-5 py-4 text-left font-mono text-[12.5px] tracking-[0.14em] whitespace-nowrap uppercase",
        className
      )}
      scope="col"
      {...props}
    />
  );
}

type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        "text-fg-dim px-5 py-4 align-middle text-[14px] leading-[1.5]",
        className
      )}
      {...props}
    />
  );
}

type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;

function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      className={cn("text-muted-2 px-5 py-4 text-left text-[13px]", className)}
      {...props}
    />
  );
}

type DefinitionTableProps = {
  rows: { label: React.ReactNode; value: React.ReactNode }[];
  className?: string;
  labelWidth?: string;
};

function DefinitionTable({ rows, className, labelWidth = "130px" }: DefinitionTableProps) {
  return (
    <div
      className={cn(
        "bg-line-soft grid gap-px overflow-hidden rounded-lg",
        className
      )}
      style={{ gridTemplateColumns: `repeat(auto-fit,${labelWidth} 1fr)` }}
    >
      {rows.map((row) => (
        <div className="contents" key={String(row.label)}>
          <div className="bg-ink px-[18px] py-3.5 font-mono text-[12.5px] tracking-[0.14em] text-faint uppercase">
            {row.label}
          </div>
          <div className="bg-ink text-fg-dim px-[18px] py-3.5 text-[14px] leading-[1.5]">
            {row.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export {
  DefinitionTable,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TableWrapper,
};
export type { DefinitionTableProps };