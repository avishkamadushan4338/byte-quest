import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";
import { cn } from "@byte-quest/ui/lib/utils";

import {
  eligibilityDivisions,
  eligibilityLead,
  eligibilitySpecs,
} from "./data";

export const Divisions = () => (
  <Section className="overflow-hidden" id="schools" tone="journey">
    <Container>
      <SectionHeader
        className="[&_h2]:text-[clamp(34px,4.4vw,60px)] [&_p]:max-w-[500px] [&_p]:text-[16.5px]"
        kicker="WHO CAN PARTICIPATE"
        lead={eligibilityLead}
        title="School teams, two divisions."
      />

      <div className="mt-12 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-4">
        {eligibilityDivisions.map((division) => (
          <div
            className="relative overflow-hidden rounded-[28px] transition-transform duration-400 hover:-translate-y-1"
            key={division.kicker}
            style={{
              background: division.background,
              border: `1px solid ${division.line}`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -40px ${division.shadow}`,
            }}
          >
            <div
              aria-hidden="true"
              className="absolute -top-[140px] -right-[120px] size-[380px] rounded-full"
              style={{
                background: `radial-gradient(circle, ${division.glow}, transparent 68%)`,
              }}
            />

            <div className="relative flex items-start justify-between gap-4 px-[clamp(24px,3.4vw,40px)] pt-[clamp(24px,3.4vw,40px)]">
              <div className="min-w-0 flex-1">
                <div
                  className="inline-flex items-center gap-2 font-mono text-[12.5px] tracking-[0.16em] whitespace-nowrap"
                  style={{ color: division.color }}
                >
                  <span
                    className="size-1.5 shrink-0 rounded-full"
                    style={{
                      background: division.color,
                      boxShadow: `0 0 10px ${division.color}`,
                    }}
                  />
                  {division.kicker}
                </div>
                <div className="font-display mt-3 text-[clamp(34px,3.6vw,48px)] leading-[0.95] font-bold tracking-[-0.04em]">
                  {division.title}
                </div>
              </div>
              <div className="text-right">
                <div className="text-muted-2 font-mono text-[12.5px] tracking-[0.16em]">
                  GRADES
                </div>
                <div
                  className={cn(
                    "font-display mt-0.5 bg-clip-text text-[clamp(56px,7vw,96px)] leading-[0.85] font-bold tracking-[-0.06em] whitespace-nowrap text-transparent",
                    division.gradeClass
                  )}
                >
                  {division.grades}
                </div>
              </div>
            </div>

            <p className="text-fg-dim relative mx-[clamp(24px,3.4vw,40px)] mt-[22px] max-w-[420px] text-[15.5px] leading-[1.55] text-pretty">
              {division.challenge}
            </p>

            <div className="border-line-soft relative mt-7 border-t bg-[rgba(2,8,7,0.35)] px-[clamp(24px,3.4vw,40px)] pt-[18px] pb-[clamp(22px,3vw,30px)]">
              <div className="text-faint font-mono text-[12.5px] tracking-[0.16em]">
                BUILD WITH
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {division.platforms.map((platform) => (
                  <span
                    className="rounded-[8px] border px-[11px] py-1.5 font-mono text-[13px] whitespace-nowrap"
                    key={platform}
                    style={{
                      background: division.chipBackground,
                      borderColor: division.chipLine,
                      color: division.color,
                    }}
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface border-line mt-4 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))] overflow-hidden rounded-[20px] border">
        {eligibilitySpecs.map((spec) => (
          <div
            className="border-line-soft flex items-center gap-[18px] border-r px-[clamp(20px,2.6vw,28px)] py-[22px]"
            key={spec.kicker}
          >
            <div
              className="font-display text-[clamp(30px,3vw,40px)] leading-[1] font-bold tracking-[-0.04em] whitespace-nowrap"
              style={{ color: spec.color }}
            >
              {spec.value}
            </div>
            <div className="min-w-0">
              <div className="text-muted-2 font-mono text-[12.5px] tracking-[0.16em]">
                {spec.kicker}
              </div>
              <div className="text-muted mt-1 text-[15px] leading-[1.45]">
                {spec.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </Section>
);
