import { cn } from "@byte-quest/ui/lib/utils";

export interface Fact {
  label: string;
  value: string;
  color: string;
}

interface FactStripProps {
  facts: Fact[];
  compact?: boolean;
}

export const FactStrip = ({ facts, compact }: FactStripProps) => (
  <div
    className={cn(
      "mt-12 grid overflow-hidden rounded-[16px] border border-[rgba(185,245,208,0.1)] bg-[rgba(2,8,7,0.5)]",
      compact
        ? "[grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr))]"
        : "[grid-template-columns:repeat(auto-fit,minmax(min(100%,160px),1fr))]"
    )}
  >
    {facts.map((fact) => (
      <div
        className="border-r border-[rgba(185,245,208,0.08)] px-5 py-[18px]"
        key={fact.label}
      >
        <div className="text-faint font-mono text-[10px] tracking-[0.14em]">
          {fact.label}
        </div>
        <div
          className={cn(
            "font-display mt-1.5 font-bold tracking-[-0.02em]",
            compact ? "text-[22px] whitespace-nowrap" : "text-[26px]"
          )}
          style={{ color: fact.color }}
        >
          {fact.value}
        </div>
      </div>
    ))}
  </div>
);
