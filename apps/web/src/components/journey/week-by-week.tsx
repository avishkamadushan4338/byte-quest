import { SectionHeading } from "@/components/site/section-heading";
import { SegmentedTabs } from "@/components/site/segmented-tabs";

import { phaseFilters, timelineWeeks } from "./data";
import type { PhaseFilter, TimelineWeek } from "./data";

interface WeekByWeekProps {
  phase: PhaseFilter;
  onPhaseChange: (phase: PhaseFilter) => void;
}

const GRAND_FINAL_WEEK = 12;

const weekStyles = (item: TimelineWeek) => {
  const gold = item.week === GRAND_FINAL_WEEK;
  if (!item.milestone) {
    return {
      dot: {
        background: "#020807",
        color: item.accent,
        border: `1px solid ${item.line}`,
        boxShadow: "none",
      },
      card: {
        background: "#030F0B",
        border: "1px solid rgba(185,245,208,0.08)",
      },
      tag: {},
    };
  }
  return {
    dot: {
      background: gold ? "#D4AF37" : "#B7F000",
      color: "#020807",
      border: "1px solid transparent",
      boxShadow: gold
        ? "0 0 22px rgba(212,175,55,0.5)"
        : "0 0 22px rgba(183,240,0,0.4)",
    },
    card: {
      background: gold ? "rgba(212,175,55,0.06)" : "rgba(183,240,0,0.05)",
      border: `1px solid ${gold ? "rgba(212,175,55,0.3)" : "rgba(183,240,0,0.25)"}`,
    },
    tag: {
      color: gold ? "#F0D875" : "#B7F000",
      border: `1px solid ${gold ? "rgba(240,216,117,0.4)" : "rgba(183,240,0,0.4)"}`,
    },
  };
};

export const WeekByWeek = ({ onPhaseChange, phase }: WeekByWeekProps) => {
  const visibleWeeks = timelineWeeks.filter(
    (item) => phase === 0 || item.phase === phase
  );

  return (
    <section
      className="px-[clamp(20px,5vw,64px)] py-[clamp(56px,7vw,96px)]"
      id="timeline"
      style={{
        background: "linear-gradient(180deg,#020807,#051712 40%,#020807)",
      }}
    >
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-start gap-x-[72px] gap-y-10">
        <div className="sticky top-[110px] flex-[1_1_300px]">
          <SectionHeading kicker="WEEK BY WEEK" title="The full programme." />
          <p className="text-muted mt-[18px] mb-0 max-w-[380px] text-[16px] leading-[1.6]">
            Filter by phase, or follow the journey from orientation to the Grand
            Final.
          </p>
          <SegmentedTabs
            className="mt-6"
            label="Filter by phase"
            onChange={(index) => onPhaseChange(index as PhaseFilter)}
            options={phaseFilters}
            value={phase}
          />
          <div className="text-muted-2 mt-5 flex flex-wrap gap-3.5 text-[12.5px]">
            <span className="flex items-center gap-2">
              <span className="bg-lime size-2 rounded-full" />
              Hackathon
            </span>
            <span className="flex items-center gap-2">
              <span className="bg-gold size-2 rounded-full" />
              Grand Final
            </span>
          </div>
        </div>

        <ol className="relative m-0 min-w-0 flex-[2_1_520px] list-none p-0">
          <div
            aria-hidden="true"
            className="absolute top-[22px] bottom-[22px] left-[21px] w-px bg-[linear-gradient(180deg,#00A99A,#52FF3D_60%,#D4AF37)]"
          />
          {visibleWeeks.map((item) => {
            const styles = weekStyles(item);
            return (
              <li
                className="relative grid grid-cols-[44px_1fr] gap-[18px] py-2"
                key={item.week}
              >
                <span
                  className="relative z-[1] flex size-11 items-center justify-center rounded-[12px] font-mono text-[13px]"
                  style={styles.dot}
                >
                  {item.n}
                </span>
                <div
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-[14px] px-[18px] py-3.5"
                  style={styles.card}
                >
                  <div className="min-w-0">
                    <div className="text-faint font-mono text-[10px] tracking-[0.14em]">
                      WEEK {item.week} · {item.phaseLabel}
                    </div>
                    <div className="font-display text-fg mt-[5px] text-[clamp(17px,1.6vw,20px)] font-semibold tracking-[-0.01em]">
                      {item.title}
                    </div>
                  </div>
                  {item.milestone ? (
                    <span
                      className="rounded-full px-2.5 py-[5px] font-mono text-[10px] tracking-[0.14em] whitespace-nowrap"
                      style={styles.tag}
                    >
                      {item.milestone}
                    </span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
