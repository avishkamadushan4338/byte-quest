import { SectionHeading } from "@/components/site/section-heading";

import { journeyPhases } from "./data";
import type { PhaseFilter } from "./data";

interface PhasesProps {
  phase: PhaseFilter;
  onSelect: (phase: PhaseFilter) => void;
}

export const Phases = ({ onSelect, phase }: PhasesProps) => (
  <section
    className="px-[clamp(20px,5vw,64px)] py-[clamp(56px,7vw,96px)]"
    id="phases"
  >
    <div className="mx-auto max-w-[1280px]">
      <SectionHeading
        kicker="THREE PHASES"
        title="Foundation. Development. Refinement."
      />
      <div className="mt-10 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
        {journeyPhases.map((item) => {
          const active = phase === item.index;
          return (
            <button
              aria-pressed={active}
              className="text-fg flex cursor-pointer flex-col gap-[18px] rounded-[20px] p-6 text-left font-sans shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-[250ms]"
              key={item.index}
              onClick={() => onSelect(active ? 0 : item.index)}
              style={{
                background: active
                  ? "linear-gradient(180deg,#0A2A20,#030F0B)"
                  : "#030F0B",
                border: `1px solid ${active ? item.line : "rgba(185,245,208,0.09)"}`,
              }}
              type="button"
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className="font-mono text-[13px] tracking-[0.14em]"
                  style={{ color: item.accent }}
                >
                  PHASE {item.n}
                </span>
                <span className="text-muted-2 rounded-full border border-[rgba(185,245,208,0.14)] px-2.5 py-[5px] font-mono text-[12.5px] tracking-[0.1em]">
                  {item.weeks}
                </span>
              </div>
              <div className="font-display text-[26px] leading-[1.05] font-bold tracking-[-0.02em]">
                {item.title}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.items.map((entry) => (
                  <span
                    className="text-muted rounded-[8px] bg-[rgba(185,245,208,0.05)] px-2.5 py-[5px] text-[14px]"
                    key={entry}
                  >
                    {entry}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </section>
);
