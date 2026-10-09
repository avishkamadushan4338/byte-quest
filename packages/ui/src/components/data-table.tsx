import { cn } from "@byte-quest/ui/lib/utils";
import type { ReactNode } from "react";

import { ChevronDown, ChevronRight, ChevronUp } from "@byte-quest/ui/components/icons";

export type SortDirection = "asc" | "desc";

export interface DataTableColumn<Row> {
  /** Stable key for this column, and the sort key sent to the server. */
  id: string;
  header: ReactNode;
  /** Renders the cell for a row. */
  cell: (row: Row) => ReactNode;
  /** Omit to make the column unsortable. */
  sortKey?: string;
  align?: "left" | "right";
  widthClassName?: string;
  headerClassName?: string;
  cellClassName?: string;
}

type SortState = { key: string; direction: SortDirection } | null;

export interface DataTablePagination {
  pageIndex: number;
  pageSize: number;
}

type DataTableProps<Row> = {
  caption: string;
  columns: DataTableColumn<Row>[];
  rows: Row[];
  getRowId: (row: Row) => string;
  emptyContent?: ReactNode;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  errorContent?: ReactNode;
  skeletonRows?: number;
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
  pagination?: DataTablePagination;
  total?: number;
  pageSizes?: number[];
  onPaginationChange?: (pagination: DataTablePagination) => void;
  rowHref?: (row: Row) => string | undefined;
  renderRowActions?: (row: Row) => ReactNode;
};

const alignClasses = {
  left: "text-left",
  right: "text-right",
} satisfies Record<NonNullable<DataTableColumn<never>["align"]>, string>;

const ariaSort = (direction: SortDirection) =>
  direction === "asc" ? "ascending" : "descending";

/**
 * A reusable sortable / paginated table. Sorting and pagination are manual:
 * the caller owns the state and passes the already-sliced `rows` plus the
 * server `total`, so a client-side sort can never quietly reorder a page of a
 * larger list.
 */
function DataTable<Row>({
  caption,
  columns,
  rows,
  getRowId,
  emptyContent,
  isLoading = false,
  isFetching = false,
  isError = false,
  errorContent,
  skeletonRows = 8,
  sort = null,
  onSortChange,
  pagination,
  total,
  pageSizes = [10, 25, 50],
  onPaginationChange,
  rowHref,
  renderRowActions,
}: DataTableProps<Row>) {
  const columnCount = columns.length;
  const cellAlign = (column: DataTableColumn<Row>) =>
    alignClasses[column.align ?? "left"];

  const handleSort = (column: DataTableColumn<Row>) => {
    if (!column.sortKey || !onSortChange) {
      return;
    }
    if (sort?.key !== column.sortKey) {
      onSortChange({ key: column.sortKey, direction: "asc" });
      return;
    }
    onSortChange({
      key: column.sortKey,
      direction: sort.direction === "asc" ? "desc" : "asc",
    });
  };

  const body = () => {
    if (isLoading) {
      return Array.from({ length: skeletonRows }).map((_, rowIndex) => (
        <tr className="border-line-soft border-t" key={`skeleton-${rowIndex}`}>
          {columns.map((column) => (
            <td
              className={cn("px-5 py-4", cellAlign(column), column.cellClassName)}
              key={column.id}
            >
              <span className="bg-surface-2 block h-4 w-full max-w-[180px] animate-pulse rounded" />
            </td>
          ))}
        </tr>
      ));
    }

    if (isError) {
      return (
        <tr>
          <td className="px-5 py-10" colSpan={columnCount}>
            {errorContent ?? "Something went wrong loading this list."}
          </td>
        </tr>
      );
    }

    if (rows.length === 0) {
      return (
        <tr>
          <td className="px-5 py-10" colSpan={columnCount}>
            {emptyContent ?? "Nothing here yet."}
          </td>
        </tr>
      );
    }

    return rows.map((row) => {
      const id = getRowId(row);
      const href = rowHref?.(row);

      return (
        <tr
          className="border-line-soft hover:bg-volt/4 border-t transition-colors"
          key={id}
        >
          {columns.map((column) => (
            <td
              className={cn(
                "text-fg-dim px-5 py-4 align-middle text-[14px] leading-[1.5]",
                cellAlign(column),
                column.cellClassName
              )}
              key={column.id}
            >
              {column.cell(row)}
            </td>
          ))}
          {renderRowActions ? (
            <td className="px-5 py-4 text-right align-middle">
              {renderRowActions(row)}
            </td>
          ) : null}
          {href ? (
            <td className="w-10 px-3 py-4 text-right align-middle">
              <a
                aria-label={`Open ${id}`}
                className="text-muted-2 hover:text-volt text-lg leading-none"
                href={href}
              >
                <ChevronRight className="size-4" />
              </a>
            </td>
          ) : null}
        </tr>
      );
    });
  };

  const pageCount =
    pagination && total !== undefined
      ? Math.max(1, Math.ceil(total / pagination.pageSize))
      : 1;
  const from =
    pagination && total
      ? pagination.pageIndex * pagination.pageSize + 1
      : 0;
  const to =
    pagination && total
      ? Math.min(total, (pagination.pageIndex + 1) * pagination.pageSize)
      : rows.length;

  return (
    <div className="grid gap-4">
      <div
        aria-busy={isFetching || undefined}
        className={cn(
          "border-line-soft overflow-x-auto overscroll-x-contain rounded-[20px] border",
          isFetching && "opacity-70 transition-opacity"
        )}
      >
        <table className="w-full border-collapse">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-surface-2">
            <tr>
              {columns.map((column) => {
                const isSorted = sort !== null && sort.key === column.sortKey;
                return (
                  <th
                    aria-sort={
                      isSorted && sort !== null ? ariaSort(sort.direction) : undefined
                    }
                    className={cn(
                      "text-faint px-5 py-4 font-mono text-[12.5px] tracking-[0.14em] whitespace-nowrap uppercase",
                      cellAlign(column),
                      column.widthClassName,
                      column.headerClassName
                    )}
                    key={column.id}
                    scope="col"
                  >
                    {column.sortKey && onSortChange ? (
                      <button
                        className="hover:text-volt inline-flex cursor-pointer items-center gap-1.5 transition-colors"
                        onClick={() => handleSort(column)}
                        type="button"
                      >
                        {column.header}
                        {isSorted && sort !== null ? (
                          sort.direction === "asc" ? (
                            <ChevronUp className="size-3.5" />
                          ) : (
                            <ChevronDown className="size-3.5" />
                          )
                        ) : null}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
              {renderRowActions ? (
                <th className="text-faint px-5 py-4 text-right font-mono text-[12.5px] tracking-[0.14em] uppercase">
                  Controls
                </th>
              ) : null}
              {rowHref ? <th className="w-10" /> : null}
            </tr>
          </thead>
          <tbody className="bg-surface">{body()}</tbody>
        </table>
      </div>

      {pagination && onPaginationChange && total !== undefined ? (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-muted-2 text-[13px]">
            Showing {from}–{to} of {total}
          </p>
          <div className="flex items-center gap-4">
            <label className="text-muted-2 flex items-center gap-2 text-[13px]">
              Rows
              <select
                className="border-line-strong bg-surface-2 rounded-lg border px-2 py-1.5 text-[13px] text-fg"
                onChange={(event) =>
                  onPaginationChange({
                    pageIndex: 0,
                    pageSize: Number(event.currentTarget.value),
                  })
                }
                value={pagination.pageSize}
              >
                {pageSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            {pageCount > 1 ? (
              <div className="flex items-center gap-2">
                <button
                  className="border-line-strong text-fg hover:border-volt cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] disabled:pointer-events-none disabled:opacity-40"
                  disabled={pagination.pageIndex === 0}
                  onClick={() =>
                    onPaginationChange({
                      ...pagination,
                      pageIndex: pagination.pageIndex - 1,
                    })
                  }
                  type="button"
                >
                  Previous
                </button>
                <span className="text-muted-2 text-[13px]">
                  Page {pagination.pageIndex + 1} of {pageCount}
                </span>
                <button
                  className="border-line-strong text-fg hover:border-volt cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] disabled:pointer-events-none disabled:opacity-40"
                  disabled={pagination.pageIndex >= pageCount - 1}
                  onClick={() =>
                    onPaginationChange({
                      ...pagination,
                      pageIndex: pagination.pageIndex + 1,
                    })
                  }
                  type="button"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { DataTable };
export type { DataTableProps };