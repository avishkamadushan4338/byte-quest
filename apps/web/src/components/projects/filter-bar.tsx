import { categoryFilters, divisionFilters } from "./data";

interface FilterBarProps {
  divisionIndex: number;
  categoryIndex: number;
  query: string;
  onDivisionChange: (index: number) => void;
  onCategoryChange: (index: number) => void;
  onQueryChange: (query: string) => void;
}

export const FilterBar = ({
  divisionIndex,
  categoryIndex,
  query,
  onDivisionChange,
  onCategoryChange,
  onQueryChange,
}: FilterBarProps) => (
  <div className="sticky top-[76px] z-[5] flex flex-wrap items-center justify-between gap-2.5 rounded-[16px] border border-[rgba(185,245,208,0.09)] bg-[rgba(3,15,11,0.9)] p-2.5 backdrop-blur-[14px]">
    <div
      aria-label="Division"
      className="bg-ink flex gap-1 rounded-[11px] p-1"
      role="tablist"
    >
      {divisionFilters.map((division, index) => {
        const on = divisionIndex === index;
        return (
          <button
            aria-selected={on}
            className="cursor-pointer rounded-[8px] border-none px-3.5 py-2 font-mono text-[13px] tracking-[0.06em] whitespace-nowrap"
            key={division}
            onClick={() => onDivisionChange(index)}
            role="tab"
            style={{
              background: on ? "#F2F7F4" : "transparent",
              color: on ? "#020807" : "#B9C9C1",
            }}
            type="button"
          >
            {division}
          </button>
        );
      })}
    </div>
    <div className="flex flex-[1_1_300px] flex-wrap gap-1.5">
      {categoryFilters.map((category, index) => {
        const on = categoryIndex === index;
        return (
          <button
            aria-pressed={on}
            className="cursor-pointer rounded-full px-3 py-[7px] font-sans text-[14px] whitespace-nowrap"
            key={category}
            onClick={() => onCategoryChange(index)}
            style={{
              background: on ? "rgba(82,255,61,0.1)" : "transparent",
              color: on ? "#52FF3D" : "#B9C9C1",
              border: `1px solid ${on ? "rgba(82,255,61,0.45)" : "rgba(185,245,208,0.12)"}`,
            }}
            type="button"
          >
            {category}
          </button>
        );
      })}
    </div>
    <label className="bg-ink flex h-[38px] min-w-[180px] flex-[0_1_240px] items-center gap-2 rounded-[10px] border border-[rgba(185,245,208,0.12)] px-3">
      <span aria-hidden="true" className="text-faint">
        ⌕
      </span>
      <input
        aria-label="Search projects"
        className="text-fg min-w-0 flex-1 border-none bg-transparent font-sans text-[15px] outline-none"
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search projects or schools"
        type="search"
        value={query}
      />
    </label>
  </div>
);
