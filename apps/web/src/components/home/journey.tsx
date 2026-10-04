import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";

import { phases } from "./data";

export const Journey = () => (
  <Section id="journey" tone="journey">
    <Container>
      <SectionHeader
        kicker="03 / The Journey"
        lead="Twelve weeks across three phases — each one moving teams closer to a working, presentable solution."
        title="From curiosity to creation."
      />

      <div className="mt-14 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
        {phases.map((phase) => (
          <article
            className="border-line-soft relative flex flex-col gap-5 rounded-[20px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0)),#030F0B] p-[26px] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            key={phase.n}
          >
            <div className="flex items-center gap-3.5">
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-xl border font-mono text-[13px]"
                style={{
                  borderColor: phase.line,
                  background: `radial-gradient(circle, ${phase.glow}, transparent 70%)`,
                  color: phase.color,
                }}
              >
                {phase.n}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-[21px] font-semibold tracking-[-0.015em]">
                  {phase.title}
                </div>
                <div className="text-muted-2 mt-[3px] font-mono text-[11px] tracking-[0.1em]">
                  {phase.weeks}
                </div>
              </div>
            </div>

            <div className="bg-line-soft h-0.5 overflow-hidden rounded-sm">
              <div
                className="h-full"
                style={{
                  width: phase.fill,
                  background: phase.color,
                  boxShadow: `0 0 10px ${phase.color}`,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-x-3.5 gap-y-2.5">
              {phase.items.map((item) => (
                <div
                  className="text-muted flex items-center gap-2 text-[13.5px]"
                  key={item}
                >
                  <span
                    className="size-1 shrink-0 rounded-full"
                    style={{ background: phase.color }}
                  />
                  {item}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Container>
  </Section>
);
