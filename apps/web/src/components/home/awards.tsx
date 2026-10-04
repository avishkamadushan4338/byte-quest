import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";

import { podium, specialAwards } from "./data";

export const Awards = () => (
  <Section id="awards" tone="gold">
    <Container>
      <SectionHeader
        align="center"
        kicker="10 / Awards & Recognition"
        kickerTone="gold"
        title={
          <>
            Excellence, <span className="text-gold-bright">recognised.</span>
          </>
        }
      />

      <div className="mt-12 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))] items-stretch gap-4">
        <div className="border-gold/20 flex flex-col justify-end rounded-3xl border bg-[linear-gradient(180deg,rgba(212,175,55,0.06),rgba(2,8,7,0)),#030F0B] px-6 pt-7 pb-0">
          <div className="grid grid-cols-[1fr_1.15fr_1fr] items-end gap-2">
            {podium.map((place) => (
              <div
                className="flex flex-col items-center gap-3"
                key={place.rank}
              >
                <div
                  className="font-display flex items-center justify-center rounded-full text-[17px] font-bold"
                  style={{
                    width: place.medal,
                    height: place.medal,
                    color: "#2A2106",
                    background:
                      "radial-gradient(circle at 35% 30%, #F0D875, #D4AF37 45%, #7A6216 100%)",
                    boxShadow: `0 0 40px rgba(212,175,55,${place.glow}), inset 0 -4px 10px rgba(0,0,0,0.35)`,
                  }}
                >
                  {place.rank}
                </div>
                <div
                  className="border-gold/30 flex w-full items-start justify-center rounded-t-xl border border-b-0 bg-[linear-gradient(180deg,rgba(212,175,55,0.2),rgba(212,175,55,0.02))] pt-3.5"
                  style={{ height: place.height }}
                >
                  <div className="font-display text-center text-[clamp(12px,1.2vw,15px)] font-semibold whitespace-nowrap">
                    {place.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-line-soft bg-surface rounded-3xl border p-6">
          <div className="text-muted-2 font-mono text-[10.5px] tracking-[0.16em]">
            SPECIAL AWARDS
          </div>
          <div className="bg-line-soft mt-4 grid [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] gap-px overflow-hidden rounded-xl">
            {specialAwards.map((award) => (
              <div
                className="bg-surface text-fg-strong flex items-center gap-2.5 p-3.5 text-[13.5px]"
                key={award}
              >
                <span className="bg-gold size-1.5 shrink-0 rotate-45" />
                {award}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  </Section>
);
