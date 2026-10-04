import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";

import { divisions } from "./data";

export const Divisions = () => (
  <Section id="divisions">
    <Container>
      <SectionHeader
        kicker="05 / Two Divisions"
        lead="Teams of 3–5 students compete within their division."
        title="A challenge for every stage."
      />

      <div className="mt-14 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-4">
        {divisions.map((division) => (
          <article
            className="relative flex flex-col gap-[22px] overflow-hidden rounded-3xl p-[clamp(24px,3vw,36px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            key={division.name}
            style={{
              background: division.bg,
              border: `1px solid ${division.border}`,
            }}
          >
            <div
              aria-hidden="true"
              className="absolute -top-[120px] -right-[100px] size-80 rounded-full"
              style={{
                background: `radial-gradient(circle, ${division.glow}, transparent 70%)`,
              }}
            />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div
                  className="font-mono text-[10.5px] tracking-[0.16em]"
                  style={{ color: division.accent }}
                >
                  {division.label}
                </div>
                <h3 className="mt-2.5 text-[clamp(40px,4.5vw,60px)] leading-[0.9] tracking-[-0.045em]">
                  {division.name}
                </h3>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-muted-2 font-mono text-[10px] tracking-[0.14em]">
                  GRADES
                </div>
                <div className="font-display mt-1 text-[32px] font-semibold tracking-[-0.03em] whitespace-nowrap">
                  {division.grades}
                </div>
              </div>
            </div>

            <div className="border-line-soft relative rounded-[14px] border bg-[rgba(2,8,7,0.45)] px-[18px] py-4">
              <div className="text-muted-2 font-mono text-[10px] tracking-[0.14em]">
                THE CHALLENGE
              </div>
              <p className="text-fg-strong mt-1.5 text-[15.5px] leading-[1.5]">
                {division.challenge}
              </p>
            </div>

            <div className="relative grid [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] gap-[18px]">
              <div>
                <div className="text-muted-2 mb-2.5 font-mono text-[10px] tracking-[0.14em]">
                  FOCUS
                </div>
                <div className="grid gap-[7px]">
                  {division.focus.map((item) => (
                    <div
                      className="text-fg-dim flex items-center gap-2 text-[13.5px]"
                      key={item}
                    >
                      <span
                        className="size-1 shrink-0 rounded-full"
                        style={{ background: division.accent }}
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-muted-2 mb-2.5 font-mono text-[10px] tracking-[0.14em]">
                  PLATFORMS
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {division.platforms.map((platform) => (
                    <span
                      className="rounded-[7px] border px-2.5 py-[5px] font-mono text-[11.5px] whitespace-nowrap"
                      key={platform}
                      style={{
                        color: division.accent,
                        borderColor: division.accentLine,
                      }}
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Container>
  </Section>
);
