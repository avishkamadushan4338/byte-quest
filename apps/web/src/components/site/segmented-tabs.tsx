import { cn } from "@byte-quest/ui/lib/utils";

interface SegmentedTabsProps {
  label: string;
  options: string[];
  value: number;
  onChange: (index: number) => void;
  className?: string;
}

export const SegmentedTabs = ({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedTabsProps) => (
  <div
    aria-label={label}
    className={cn(
      "bg-surface flex w-fit max-w-full flex-wrap gap-1 rounded-[14px] border border-[rgba(185,245,208,0.08)] p-1.5",
      className
    )}
    role="tablist"
  >
    {options.map((option, index) => {
      const active = value === index;
      return (
        <button
          aria-selected={active}
          className="cursor-pointer rounded-[9px] border-none px-3.5 py-2 font-mono text-[13px] tracking-[0.06em] whitespace-nowrap"
          key={option}
          onClick={() => onChange(index)}
          role="tab"
          style={{
            background: active ? "#F2F7F4" : "transparent",
            color: active ? "#020807" : "#B9C9C1",
          }}
          type="button"
        >
          {option}
        </button>
      );
    })}
  </div>
);
