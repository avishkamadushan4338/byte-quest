import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";
import { cn } from "@byte-quest/ui/lib/utils";
import { useState } from "react";

import { milestoneWeeks, phaseOf, weekTags, weeks } from "./data";

const isMilestone = (week: number) => milestoneWeeks.includes(week);

const weekButtonBase =
  "flex size-11 items-center justify-center rounded-xl border font-mono text-[13px] transition-all duration-300";

const weekButtonClasses = (week: number, active: number) => {
  const isGold = week === 12;
  const done = week < active;
  const milestone = isMilestone(week);

  if (week === active) {
    return cn(
      weekButtonBase,
      isGold
        ? "bg-gold text-ink border-transparent shadow-[0_0_24px_rgba(212,175,55,0.55)]"
        : "bg-volt text-ink border-transparent shadow-[0_0_24px_rgba(82,255,61,0.5)]"
    );
  }

  let border = "border-line";
  if (milestone) {
    border = isGold ? "border-gold/55" : "border-lime/45";
  }

  const background = done ? "bg-[#0A3D2C]" : "bg-ink";
  const foreground = done && milestone ? "text-mint" : "text-muted";

  return cn(weekButtonBase, border, background, foreground);
};

export const Timeline = () => {
  const [activeWeek, setActiveWeek] = useState(6);
  const current = weeks[activeWeek - 1] ?? "";
  const upcoming = weeks
    .slice(activeWeek, activeWeek + 3)
    .map((title, index) => ({ week: activeWeek + 1 + index, title }));

  const selectWeek = (week: number) => setActiveWeek(week);

  return (
    <Section id="timeline" tone="alt">
      <Container>
        <SectionHeader
          kicker="11 / Programme Timeline"
          lead="Select a week to see what happens. Official dates will be announced."
          title="Week by week."
        />

        <div className="mt-11 overflow-x-auto pb-1.5">
          <div className="relative min-w-[620px]">
            <div className="bg-line-strong absolute top-[21px] right-[22px] left-[22px] h-px" />
            <div
              className="absolute top-[21px] left-[22px] h-px bg-[linear-gradient(90deg,#00A99A,#52FF3D)] shadow-[0_0_10px_#52FF3D] transition-[width] duration-500"
              style={{
                width: `calc((100% - 44px) * ${(activeWeek - 1) / 11})`,
              }}
            />
            <div
              aria-label="Programme weeks"
              className="relative grid grid-cols-12"
              role="tablist"
            >
              {weeks.map((title, index) => {
                const week = index + 1;
                const active = week === activeWeek;
                const tag = weekTags[week];

                return (
                  <button
                    aria-selected={active}
                    className="text-fg flex cursor-pointer flex-col items-center gap-2 border-none bg-transparent p-0"
                    key={week}
                    onClick={() => selectWeek(week)}
                    role="tab"
                    type="button"
                  >
                    <span className={weekButtonClasses(week, activeWeek)}>
                      {week}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[9.5px] tracking-[0.08em] whitespace-nowrap",
                        week === 12 ? "text-gold-bright" : "text-lime"
                      )}
                    >
                      {tag}
                    </span>
                    <span className="sr-only">
                      Week {week}: {title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-7 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-4">
          <div
            className="bg-ink flex flex-col gap-4 rounded-[20px] p-[clamp(22px,3vw,32px)]"
            style={{
              border: `1px solid ${
                isMilestone(activeWeek)
                  ? "rgba(183,240,0,0.3)"
                  : "rgba(185,245,208,0.1)"
              }`,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 font-mono text-[11px] tracking-[0.12em]">
                <span className="text-volt">WEEK {activeWeek}</span>
                <span className="text-faint-2">/</span>
                <span className="text-muted-2">{phaseOf(activeWeek)}</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  aria-label="Previous week"
                  className="border-line-strong text-fg hover:border-volt size-9 cursor-pointer rounded-full border bg-transparent transition-colors disabled:opacity-40"
                  disabled={activeWeek <= 1}
                  onClick={() => selectWeek(Math.max(1, activeWeek - 1))}
                  type="button"
                >
                  ←
                </button>
                <button
                  aria-label="Next week"
                  className="border-line-strong text-fg hover:border-volt size-9 cursor-pointer rounded-full border bg-transparent transition-colors disabled:opacity-40"
                  disabled={activeWeek >= weeks.length}
                  onClick={() =>
                    selectWeek(Math.min(weeks.length, activeWeek + 1))
                  }
                  type="button"
                >
                  →
                </button>
              </div>
            </div>

            <div className="text-[clamp(26px,3vw,38px)] leading-[1.05] font-bold tracking-[-0.03em]">
              {current}
            </div>

            {isMilestone(activeWeek) ? (
              <div className="border-lime/35 bg-lime/8 text-lime inline-flex items-center gap-2 self-start rounded-full border px-3 py-1.5 font-mono text-[10.5px] tracking-[0.12em] whitespace-nowrap">
                ★ MAJOR MILESTONE
              </div>
            ) : null}
          </div>

          <div className="border-line-soft bg-surface rounded-[20px] border p-[clamp(22px,3vw,32px)]">
            <div className="text-muted-2 font-mono text-[10.5px] tracking-[0.14em]">
              UP NEXT
            </div>
            <div className="mt-3 grid">
              {upcoming.map((item) => (
                <button
                  className="border-line-soft text-fg-dim hover:text-volt flex cursor-pointer items-center gap-3.5 border-b bg-transparent py-3 text-left text-[14px] transition-colors"
                  key={item.week}
                  onClick={() => selectWeek(item.week)}
                  type="button"
                >
                  <span className="text-faint-2 w-12 shrink-0 font-mono text-[11px]">
                    WK {item.week}
                  </span>
                  {item.title}
                </button>
              ))}
              {activeWeek === weeks.length ? (
                <div className="text-gold-bright py-3 text-[14px]">
                  The finale — see you at the Expo.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
