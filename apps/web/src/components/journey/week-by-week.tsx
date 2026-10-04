import { Badge } from "@byte-quest/ui/components/badge";
import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";
import { cn } from "@byte-quest/ui/lib/utils";
import { TabsList, TabsRoot, TabsTab } from "@byte-quest/ui/primitives/tabs";

import { phaseFilters, timelineWeeks } from "./data";
import type { PhaseFilter } from "./data";

interface WeekByWeekProps {
  phase: PhaseFilter;
  onPhaseChange: (phase: PhaseFilter) => void;
}

const milestoneBadgeTone = (milestone: string) =>
  milestone === "GRAND FINAL" ? "gold" : "volt";

const entryCardClasses = (milestone?: string) => {
  if (milestone === "GRAND FINAL") {
    return "border-gold/35 bg-gold/6";
  }
  if (milestone) {
    return "border-lime/30 bg-lime/5";
  }
  return "border-line-soft bg-surface";
};

const weekNumberClasses = (milestone?: string) => {
  if (milestone === "GRAND FINAL") {
    return "border-transparent bg-gold text-ink shadow-[0_0_22px_rgba(212,175,55,0.5)]";
  }
  if (milestone) {
    return "border-transparent bg-lime text-ink shadow-[0_0_22px_rgba(183,240,0,0.4)]";
  }
  return "border bg-ink";
};

export const WeekByWeek = ({ onPhaseChange, phase }: WeekByWeekProps) => {
  const selectPhase = (value: number) => {
    onPhaseChange(value as PhaseFilter);
  };

  const visibleWeeks = timelineWeeks.filter(
    (item) => phase === 0 || item.phase === phase
  );

  return (
    <Section id="timeline" tone="journey">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-x-[clamp(40px,6vw,88px)]">
          <div className="lg:sticky lg:top-[110px] lg:self-start">
            <SectionHeader
              kicker="WEEK BY WEEK"
              lead="Filter by phase, or follow the journey from orientation to the Grand Final."
              title="The full programme."
            />

            <TabsRoot
              className="mt-9"
              onValueChange={(value) => {
                selectPhase(Number(value));
              }}
              value={String(phase)}
            >
              <TabsList aria-label="Filter by phase">
                {phaseFilters.map((filter, index) => (
                  <TabsTab key={filter} value={String(index)}>
                    {filter}
                  </TabsTab>
                ))}
              </TabsList>
            </TabsRoot>

            <div className="text-muted-2 mt-6 flex flex-wrap items-center gap-5 text-[12.5px]">
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="bg-lime size-2 rounded-full"
                />
                Hackathon
              </span>
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="bg-gold size-2 rounded-full"
                />
                Grand Final
              </span>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute top-[22px] bottom-[22px] left-[21px] w-px bg-[linear-gradient(180deg,#00a99a,#52ff3d_60%,#d4af37)]"
            />
            <ol className="relative">
              {visibleWeeks.map((item) => (
                <li
                  className="grid grid-cols-[44px_1fr] items-start gap-4 py-2"
                  key={item.week}
                >
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-[12px] font-mono text-[13px]",
                      weekNumberClasses(item.milestone)
                    )}
                    style={
                      item.milestone
                        ? undefined
                        : { borderColor: item.accent, color: item.accent }
                    }
                  >
                    {item.n}
                  </span>

                  <div
                    className={cn(
                      "flex items-start justify-between gap-4 rounded-[14px] border p-3.5 px-[18px]",
                      entryCardClasses(item.milestone)
                    )}
                  >
                    <div className="min-w-0">
                      <div className="text-faint font-mono text-[10px] tracking-[0.14em]">
                        WEEK {item.n} · {item.phaseLabel}
                      </div>
                      <div className="font-display text-fg mt-1.5 text-[clamp(17px,1.6vw,20px)] font-semibold tracking-[-0.02em]">
                        {item.title}
                      </div>
                    </div>
                    {item.milestone ? (
                      <Badge tone={milestoneBadgeTone(item.milestone)}>
                        {item.milestone}
                      </Badge>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  );
};
