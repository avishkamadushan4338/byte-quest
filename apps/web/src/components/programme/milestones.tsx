import { useState } from "react";

import { SectionHeading } from "@/components/site/section-heading";

import { milestones } from "./data";

export const Milestones = () => {
  const [active, setActive] = useState(0);
  const moment = milestones[active];

  return (
    <section
      className="px-[clamp(20px,5vw,64px)] py-[clamp(56px,7vw,96px)]"
      id="milestones"
      style={{
        background: "linear-gradient(180deg,#020807,#051712 50%,#020807)",
      }}
    >
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading
          kicker="THE THREE BIG MOMENTS"
          title="Two hackathons. One grand finale."
        />
        <div
          aria-label="Milestones"
          className="mt-9 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-2"
          role="tablist"
        >
          {milestones.map((item, index) => {
            const on = index === active;
            return (
              <button
                aria-selected={on}
                className="text-fg flex cursor-pointer flex-col gap-1.5 rounded-[16px] px-5 py-[18px] text-left font-sans transition-all duration-200"
                key={item.kicker}
                onClick={() => setActive(index)}
                role="tab"
                style={{
                  background: on
                    ? "linear-gradient(180deg,#0A2A20,#030F0B)"
                    : "#030F0B",
                  border: `1px solid ${on ? item.color : "rgba(185,245,208,0.09)"}`,
                }}
                type="button"
              >
                <span
                  className="font-mono text-[10.5px] tracking-[0.14em]"
                  style={{ color: item.color }}
                >
                  {item.kicker} · WEEK {item.week}
                </span>
                <span className="font-display text-[20px] font-bold tracking-[-0.015em]">
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
        <div
          className="mt-3 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-14 gap-y-8 rounded-[24px] p-[clamp(22px,3.5vw,40px)]"
          role="tabpanel"
          style={{
            background: `radial-gradient(60% 90% at 100% 0%, ${moment.tint}, transparent 60%), #030F0B`,
            border: `1px solid ${moment.line}`,
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="font-mono text-[10.5px] tracking-[0.14em] whitespace-nowrap"
                style={{ color: moment.color }}
              >
                {moment.kicker}
              </span>
              <span className="text-gold-bright rounded-full border border-[rgba(240,216,117,0.3)] px-[9px] py-[3px] font-mono text-[10.5px] tracking-[0.12em] whitespace-nowrap">
                DATE TBA
              </span>
            </div>
            <div className="font-display text-[clamp(30px,3.4vw,44px)] leading-none font-bold tracking-[-0.035em]">
              {moment.title}
            </div>
            <p className="text-muted m-0 text-[15.5px] leading-[1.6]">
              {moment.description}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {moment.flow.map((step, index) => (
                <span
                  className="font-display inline-flex items-center gap-2 text-[15px] font-medium whitespace-nowrap"
                  key={step}
                >
                  <span aria-hidden="true" style={{ color: moment.color }}>
                    {index > 0 ? "→" : ""}
                  </span>
                  {step}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-px self-start overflow-hidden rounded-[16px] bg-[rgba(185,245,208,0.08)]">
            {moment.rows.map((row) => (
              <div
                className="bg-ink grid grid-cols-[130px_1fr] gap-3.5 px-[18px] py-3.5 text-[14px]"
                key={row.label}
              >
                <span className="text-faint pt-0.5 font-mono text-[10.5px] tracking-[0.12em]">
                  {row.label}
                </span>
                <span className="text-fg-dim leading-[1.5]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
