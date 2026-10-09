import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";
import { cn } from "@byte-quest/ui/lib/utils";

import { phases } from "./data";

export const Journey = () => (
  <Section id="journey" tone="journey">
    <Container>
      <SectionHeader
        kicker="03 / The Journey"
        lead="Twelve weeks across three phases - each one moving teams closer to a working, presentable solution."
        title="From curiosity to creation."
      />

      <div className="relative mt-16">
        <div
          aria-hidden="true"
          className="bg-line-soft absolute inset-x-0 top-1.5 hidden h-0.5 rounded-[2px] min-[1000px]:block"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-1.5 hidden h-0.5 rounded-[2px] bg-[linear-gradient(90deg,#00A99A,#52FF3D_50%,#D4AF37)] shadow-[0_0_18px_rgba(82,255,61,0.45)] min-[1000px]:block"
        />

        <div className="relative grid grid-cols-1 gap-4 min-[1000px]:grid-cols-3">
          {phases.map((phase) => (
            <article className="relative flex flex-col" key={phase.n}>
              <div className="flex h-[14px] items-center">
                <span
                  aria-hidden="true"
                  className="size-[14px] shrink-0 rounded-full"
                  style={{
                    background: phase.color,
                    boxShadow: `0 0 0 5px #041410, 0 0 0 6px ${phase.line}, 0 0 22px ${phase.color}`,
                  }}
                />
                <span
                  className="ml-2 bg-[#041611] px-3 font-mono text-[13px] tracking-[0.16em] whitespace-nowrap"
                  style={{ color: phase.color }}
                >
                  PHASE {phase.n} · {phase.weeks}
                </span>
              </div>

              <div
                className={cn(
                  "relative mt-[18px] flex flex-1 flex-col gap-[26px] overflow-hidden rounded-[28px] p-[clamp(24px,2.6vw,34px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:-translate-y-1.5",
                  phase.hoverBorder,
                  phase.hoverShadow
                )}
                style={{
                  background: `radial-gradient(90% 60% at 100% 0%, ${phase.glow}, transparent 60%), linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0) 40%), #030F0B`,
                  border: "1px solid rgba(185,245,208,0.1)",
                }}
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    "font-display pointer-events-none absolute -top-[28px] -right-2 text-[180px] leading-none font-bold tracking-[-0.07em] text-transparent",
                    phase.strokeClass
                  )}
                >
                  {phase.n}
                </div>

                <div className="relative pr-[90px]">
                  <h3 className="font-display text-[clamp(28px,2.6vw,36px)] leading-[1] font-bold tracking-[-0.035em]">
                    {phase.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.55] text-pretty text-[#C9D8D1]">
                    {phase.lead}
                  </p>
                </div>

                <ul className="relative m-0 flex list-none flex-wrap gap-2 p-0">
                  {phase.items.map((item) => (
                    <li
                      className="text-fg-strong inline-flex items-center gap-[9px] rounded-full border border-[rgba(185,245,208,0.1)] bg-[rgba(2,8,7,0.6)] px-3.5 py-[9px] text-[15px] whitespace-nowrap"
                      key={item}
                    >
                      <span
                        className="size-[5px] shrink-0 rounded-full"
                        style={{
                          background: phase.color,
                          boxShadow: `0 0 8px ${phase.color}`,
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-auto flex items-center justify-between gap-3 border-t border-[rgba(185,245,208,0.08)] pt-[18px]">
                  <span className="text-faint font-mono text-[12.5px] tracking-[0.14em]">
                    OUTCOME
                  </span>
                  <span
                    className="font-display text-right text-[14.5px] font-semibold"
                    style={{ color: phase.color }}
                  >
                    {phase.outcome}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Container>
  </Section>
);
