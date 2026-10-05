import { Search } from "@byte-quest/ui/components/icons";
import { cn } from "@byte-quest/ui/lib/utils";

import { categoryFilters, divisionFilters } from "./data";

interface FilterBarProps {
  divisionIndex: number;
  categoryIndex: number;
  query: string;
  onDivisionChange: (index: number) => void;
  onCategoryChange: (index: number) => void;
  onQueryChange: (value: string) => void;
}

export const FilterBar = ({
  divisionIndex,
  categoryIndex,
  query,
  onDivisionChange,
  onCategoryChange,
  onQueryChange,
}: FilterBarProps) => (
  <div className="border-line-soft sticky top-[76px] z-[5] flex flex-wrap items-center gap-2.5 rounded-2xl border bg-[rgba(3,15,11,0.9)] p-2.5 backdrop-blur-[14px]">
    <div
      aria-label="Division"
      className="bg-ink flex rounded-[11px] p-1"
      role="tablist"
    >
      {divisionFilters.map((filter, index) => (
        <button
          aria-pressed={divisionIndex === index}
          className={cn(
            "cursor-pointer rounded-[8px] border-none px-3.5 py-[7px] font-mono text-[11.5px] tracking-[0.08em] whitespace-nowrap transition-colors",
            divisionIndex === index
              ? "bg-fg text-ink"
              : "text-muted hover:text-fg bg-transparent"
          )}
          key={filter}
          onClick={() => onDivisionChange(index)}
          type="button"
        >
          {filter}
        </button>
      ))}
    </div>

    <div className="flex flex-wrap items-center gap-2">
      {categoryFilters.map((filter, index) => (
        <button
          aria-pressed={categoryIndex === index}
          className={cn(
            "cursor-pointer rounded-full border px-3 py-[7px] text-[12.5px] whitespace-nowrap transition-colors",
            categoryIndex === index
              ? "border-volt/45 bg-volt/10 text-volt"
              : "border-line-soft text-muted hover:text-fg bg-transparent"
          )}
          key={filter}
          onClick={() => onCategoryChange(index)}
          type="button"
        >
          {filter}
        </button>
      ))}
    </div>

    <label className="border-line-soft bg-ink flex h-[38px] min-w-[210px] flex-1 items-center gap-2 rounded-[10px] border px-3">
      <Search className="text-faint size-4" />
      <input
        aria-label="Search projects"
        className="placeholder:text-faint-2 text-fg min-w-0 flex-1 cursor-pointer border-none bg-transparent text-[13.5px] outline-none"
        onChange={(event) => onQueryChange(event.currentTarget.value)}
        placeholder="Search projects or schools"
        type="search"
        value={query}
      />
    </label>
  </div>
);
