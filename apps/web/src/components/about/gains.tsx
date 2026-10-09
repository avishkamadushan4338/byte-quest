import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";
import { cn } from "@byte-quest/ui/lib/utils";

import { gains, gainsLead } from "./data";

export const Gains = () => (
  <Section className="overflow-hidden" id="gains">
    <div
      aria-hidden="true"
      className="absolute top-[20%] left-[-10%] size-[520px] rounded-full"
      style={{
        background:
          "radial-gradient(circle, rgba(0,169,154,0.12), transparent 68%)",
      }}
    />

    <Container className="relative">
      <SectionHeader
        className="[&_h2]:text-[clamp(34px,4.4vw,60px)] [&_p]:max-w-[500px] [&_p]:text-[16.5px]"
        kicker="WHAT STUDENTS GAIN"
        lead={gainsLead}
        title="Skills that outlast the programme."
      />

      <div className="mt-12 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-4">
        {gains.map((gain) => (
          <div
            className={cn(
              "relative flex min-h-[220px] flex-col justify-between gap-7 overflow-hidden rounded-[24px] p-[clamp(22px,2.6vw,30px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-1",
              gain.hoverBorder,
              gain.hoverShadow
            )}
            key={gain.id}
            style={{
              background: `linear-gradient(160deg, ${gain.tint}, rgba(3,15,11,0) 55%), #030F0B`,
              border: "1px solid rgba(185,245,208,0.09)",
            }}
          >
            <div
              aria-hidden="true"
              className={cn(
                "font-display pointer-events-none absolute -right-1.5 -bottom-[34px] text-[170px] leading-none font-bold tracking-[-0.06em] text-transparent",
                gain.strokeClass
              )}
            >
              {gain.n}
            </div>

            <div className="relative flex items-center justify-between">
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-[13px] border"
                style={{
                  background: `radial-gradient(circle, ${gain.tint}, transparent 75%)`,
                  borderColor: gain.line,
                }}
              >
                <span
                  className="size-2.5 rotate-45"
                  style={{
                    background: gain.color,
                    boxShadow: `0 0 14px ${gain.color}`,
                  }}
                />
              </span>
              <span
                className="font-mono text-[13px] tracking-[0.14em]"
                style={{ color: gain.color }}
              >
                {gain.n}
              </span>
            </div>

            <div className="relative max-w-[300px]">
              <div className="font-display text-[clamp(22px,2vw,26px)] leading-[1.05] font-bold tracking-[-0.025em]">
                {gain.title}
              </div>
              <div className="mt-2.5 text-[14.5px] leading-[1.55] text-pretty text-[#A9BBB3]">
                {gain.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </Section>
);
