import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";
import { cn } from "@byte-quest/ui/lib/utils";

import { pillars } from "./data";

export const WhatIs = () => (
  <Section
    className="py-[clamp(80px,10vw,136px)] pb-[clamp(64px,8vw,104px)]"
    id="about"
  >
    <Container>
      <SectionHeader
        kicker="02 / What is BYTE QUEST"
        lead="A three-month innovation journey where school students learn, experiment, build, receive mentorship and transform ideas into meaningful technology solutions."
        title="More than a hackathon."
      />

      <div className="relative mt-14 grid grid-cols-1 gap-[14px] min-[600px]:grid-cols-2 min-[1100px]:grid-cols-4">
        <div
          aria-hidden="true"
          className="absolute top-[62px] right-[4%] left-[4%] h-px bg-[linear-gradient(90deg,transparent,rgba(0,169,154,0.4),rgba(82,255,61,0.4),rgba(183,240,0,0.4),rgba(240,216,117,0.4),transparent)]"
        />
        {pillars.map((pillar) => (
          <div
            className={cn(
              "relative flex min-h-[300px] flex-col overflow-hidden rounded-[24px] p-[28px_26px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-[transform,border-color,box-shadow] duration-[450ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:-translate-y-1.5",
              pillar.hoverBorder,
              pillar.hoverShadow
            )}
            key={pillar.n}
            style={{
              background: `linear-gradient(180deg, ${pillar.tint}, rgba(3,15,11,0) 55%), #030F0B`,
              border: "1px solid rgba(185,245,208,0.09)",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute -top-[60px] -right-[30px] size-[220px] rounded-full"
              style={{
                background: `radial-gradient(circle closest-side, ${pillar.glow}, transparent)`,
              }}
            />
            <div
              aria-hidden="true"
              className={cn(
                "font-display pointer-events-none absolute top-[10px] right-[18px] text-[96px] leading-none font-bold tracking-[-0.06em] text-transparent",
                pillar.strokeClass
              )}
            >
              {pillar.n}
            </div>

            <div className="relative flex items-center justify-between">
              <span
                className="relative flex size-[68px] items-center justify-center rounded-[20px] border shadow-[0_0_0_6px_#030F0B]"
                style={{
                  background: `radial-gradient(circle, ${pillar.glow}, rgba(2,8,7,0.9) 75%)`,
                  borderColor: pillar.line,
                }}
              >
                <span
                  className="size-[14px] rotate-45 rounded-[3px]"
                  style={{
                    background: pillar.color,
                    boxShadow: `0 0 18px ${pillar.color}`,
                  }}
                />
              </span>
            </div>

            <div className="relative mt-auto pt-10">
              <div className="font-display text-[clamp(32px,2.8vw,42px)] leading-[1] font-bold tracking-[-0.035em]">
                {pillar.title}
                <span style={{ color: pillar.color }}>.</span>
              </div>
              <p className="text-fg-dim mt-3 text-[15.5px] leading-[1.55] text-pretty">
                {pillar.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </Section>
);
