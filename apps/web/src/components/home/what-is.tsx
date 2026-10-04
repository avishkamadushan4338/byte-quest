import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";

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

      <div className="border-line mt-14 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))] border-y">
        {pillars.map((pillar) => (
          <div
            className="group border-line-soft relative flex flex-col gap-3.5 px-6 pt-7 pb-[30px] transition-colors hover:bg-[linear-gradient(180deg,rgba(82,255,61,0.05),transparent)] [&:not(:last-child)]:border-r"
            key={pillar.n}
          >
            <div className="flex items-center justify-between">
              <span className="text-faint font-mono text-[11px] tracking-[0.12em]">
                {pillar.n}
              </span>
              <span
                className="flex size-7 items-center justify-center rounded-lg border"
                style={{ borderColor: pillar.line }}
              >
                <span
                  className="size-2 rotate-45"
                  style={{
                    background: pillar.color,
                    boxShadow: `0 0 10px ${pillar.color}`,
                  }}
                />
              </span>
            </div>
            <div
              className="font-display text-[28px] font-bold tracking-[-0.025em]"
              style={{ color: pillar.color }}
            >
              {pillar.title}
            </div>
            <p className="text-muted-2 m-0 text-[14.5px] leading-[1.55]">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </Container>
  </Section>
);
