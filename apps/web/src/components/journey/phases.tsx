import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";
import { cn } from "@byte-quest/ui/lib/utils";

import { journeyPhases } from "./data";
import type { PhaseFilter } from "./data";

interface PhasesProps {
  phase: PhaseFilter;
  onSelect: (phase: PhaseFilter) => void;
}

export const Phases = ({ onSelect, phase }: PhasesProps) => (
  <Section id="phases" tone="base">
    <Container>
      <SectionHeader
        kicker="THREE PHASES"
        title="Foundation. Development. Refinement."
      />

      <div className="mt-14 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
        {journeyPhases.map((item) => {
          const active = phase === item.index;

          return (
            <button
              aria-pressed={active}
              className={cn(
                "flex cursor-pointer flex-col gap-5 rounded-[20px] border p-[26px] text-left transition-all duration-300",
                active
                  ? "border-line-fg bg-[linear-gradient(180deg,#0a2a20,#030f0b)]"
                  : "border-line-soft bg-surface hover:border-line-fg"
              )}
              key={item.index}
              onClick={() => onSelect(active ? 0 : item.index)}
              style={active ? { borderColor: item.line } : undefined}
              type="button"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="font-mono text-[11px] tracking-[0.16em]"
                  style={{ color: item.accent }}
                >
                  PHASE {item.n}
                </span>
                <span className="border-line-strong text-muted-2 rounded-full border px-3 py-[5px] font-mono text-[10.5px] tracking-[0.12em] whitespace-nowrap">
                  {item.weeks}
                </span>
              </div>

              <div className="font-display text-[26px] font-bold tracking-[-0.025em]">
                {item.title}
              </div>

              <div className="flex flex-wrap items-center gap-y-2">
                {item.items.map((entry, index) => (
                  <span className="flex items-center gap-2" key={entry}>
                    {index > 0 ? (
                      <span
                        aria-hidden="true"
                        className="text-faint-2 text-[12.5px]"
                      >
                        ·
                      </span>
                    ) : null}
                    <span className="bg-mint/5 text-muted rounded-[8px] px-2.5 py-[5px] text-[12.5px]">
                      {entry}
                    </span>
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </Container>
  </Section>
);
