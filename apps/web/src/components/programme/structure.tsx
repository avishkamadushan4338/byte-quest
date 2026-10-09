import { SectionHeading } from "@/components/site/section-heading";

import { phases, structureLead } from "./data";

export const Structure = () => (
  <section
    className="px-[clamp(20px,5vw,64px)] py-[clamp(56px,7vw,96px)]"
    id="structure"
  >
    <div className="mx-auto max-w-[1280px]">
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-[72px] gap-y-6">
        <div>
          <SectionHeading
            kicker="HOW IT WORKS"
            title="Three phases, one continuous journey."
          />
        </div>
        <p className="text-muted m-0 max-w-[500px] text-[16.5px] leading-[1.65]">
          {structureLead}
        </p>
      </div>
      <div className="mt-10 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))] overflow-hidden rounded-[20px] border border-[rgba(185,245,208,0.1)]">
        {phases.map((phase) => (
          <div
            className="bg-surface relative flex flex-col gap-3.5 border-r border-[rgba(185,245,208,0.08)] p-[26px]"
            key={phase.n}
          >
            <div
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{ background: phase.color }}
            />
            <div className="flex items-center justify-between">
              <span
                className="font-mono text-[13px] tracking-[0.14em]"
                style={{ color: phase.color }}
              >
                PHASE {phase.n}
              </span>
              <span className="text-muted-2 font-mono text-[12.5px]">
                {phase.weeks}
              </span>
            </div>
            <div className="font-display text-[24px] font-bold tracking-[-0.02em]">
              {phase.title}
            </div>
            <div className="text-muted text-[15.5px] leading-[1.55]">
              {phase.items}
            </div>
            <div className="mt-auto flex justify-between gap-2.5 border-t border-[rgba(185,245,208,0.07)] pt-3 text-[14.5px]">
              <span className="text-faint">Milestone</span>
              <span
                className="font-semibold"
                style={{ color: phase.milestoneColor }}
              >
                {phase.milestone}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
