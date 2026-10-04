import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";

import { moments } from "./data";

export const Moments = () => (
  <Section id="programme">
    <Container>
      <SectionHeader
        kicker="04 / The Three Big Moments"
        lead="Each milestone raises the bar — from first idea to working prototype to a public showcase."
        title="Two hackathons. One grand finale."
      />

      <div className="mt-14 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
        {moments.map((moment) => (
          <article
            className="border-line-soft bg-surface hover:border-volt/35 relative flex flex-col overflow-hidden rounded-[20px] border shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300"
            key={moment.n}
          >
            <div
              className="border-line-soft relative flex h-[132px] items-center justify-center gap-3 border-b"
              style={{
                background: `radial-gradient(60% 90% at 50% 100%, ${moment.glowSoft}, transparent 70%)`,
              }}
            >
              <span
                className="font-display absolute top-4 left-[18px] text-[15px] font-bold"
                style={{ color: moment.accent }}
              >
                {moment.n}
              </span>
              <span className="border-gold/30 text-gold-bright absolute top-3.5 right-4 rounded-full border px-2.5 py-[5px] font-mono text-[10px] tracking-[0.12em] whitespace-nowrap">
                DATE TBA
              </span>
              <span
                className="size-[26px] [transform:rotateX(55deg)_rotateZ(45deg)] rounded-lg border-[1.5px] border-solid"
                style={{
                  borderColor: moment.accent,
                  boxShadow: `0 0 18px ${moment.glow}`,
                }}
              />
              <span
                className="size-[42px] [transform:rotateX(55deg)_rotateZ(45deg)] rounded-lg border-[1.5px] border-solid"
                style={{
                  borderColor: moment.accent,
                  boxShadow: `0 0 18px ${moment.glow}`,
                  background: moment.glow,
                }}
              />
              <span
                className="size-[26px] [transform:rotateX(55deg)_rotateZ(45deg)] rounded-lg border-[1.5px] border-solid"
                style={{
                  borderColor: moment.accent,
                  boxShadow: `0 0 18px ${moment.glow}`,
                }}
              />
            </div>

            <div className="flex flex-1 flex-col gap-4 p-[22px] pb-5">
              <div>
                <div
                  className="font-mono text-[10.5px] tracking-[0.14em]"
                  style={{ color: moment.accent }}
                >
                  {moment.kicker}
                </div>
                <h3 className="mt-1.5 text-[24px] leading-[1.1] tracking-[-0.02em]">
                  {moment.title}
                </h3>
              </div>

              <div className="text-muted flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px]">
                {moment.flow.map((step, index) => (
                  <span
                    className="inline-flex items-center gap-2 whitespace-nowrap"
                    key={step}
                  >
                    {index > 0 ? (
                      <span style={{ color: moment.accent }} aria-hidden="true">
                        →
                      </span>
                    ) : null}
                    {step}
                  </span>
                ))}
              </div>

              <div className="border-line-soft text-muted-2 grid gap-2 border-t pt-[14px] text-[13px] leading-[1.5]">
                <div className="flex justify-between gap-3">
                  <span className="text-fg-dim">Deliverables</span>
                  <span>With challenge brief</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-fg-dim">Judging</span>
                  <span>Criteria published prior</span>
                </div>
              </div>

              <a
                className="text-fg hover:text-volt mt-auto flex items-center justify-between text-[13.5px] font-semibold transition-colors"
                href="#programme"
              >
                View milestone{" "}
                <span style={{ color: moment.accent }} aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </Container>
  </Section>
);
