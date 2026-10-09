import { ArrowRightIcon } from "@phosphor-icons/react";

import { SectionHeading } from "@/components/site/section-heading";

import { milestones } from "./data";

export const Milestones = () => (
  <section
    className="px-[clamp(20px,5vw,64px)] py-[clamp(56px,7vw,96px)]"
    id="milestones"
  >
    <div className="mx-auto max-w-[1280px]">
      <SectionHeading
        kicker="MAJOR MILESTONES"
        title="Three moments that matter."
      />
      <div className="mt-10 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
        {milestones.map((item) => (
          <article
            className="flex flex-col gap-3.5 rounded-[20px] p-6"
            key={item.week}
            style={{
              background: `linear-gradient(180deg,${item.tint},transparent 60%),#030F0B`,
              border: `1px solid ${item.line}`,
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="font-mono text-[12.5px] tracking-[0.14em]"
                style={{ color: item.accent }}
              >
                {item.week}
              </span>
              <span className="text-gold-bright rounded-full border border-[rgba(240,216,117,0.3)] px-[9px] py-1 font-mono text-[12.5px] tracking-[0.12em]">
                DATE TBA
              </span>
            </div>
            <div>
              <div className="text-muted-2 font-mono text-[12.5px] tracking-[0.14em]">
                {item.label}
              </div>
              <div className="font-display mt-1.5 text-[24px] font-bold tracking-[-0.02em]">
                {item.title}
              </div>
            </div>
            <div className="text-muted flex flex-wrap gap-x-2 gap-y-1.5 text-[15px]">
              {item.flow.map((step, index) => (
                <span
                  className="inline-flex gap-2 whitespace-nowrap"
                  key={step}
                >
                  <span aria-hidden="true" style={{ color: item.accent }}>
                    {index > 0 ? <ArrowRightIcon weight="bold" /> : null}
                  </span>
                  {step}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
