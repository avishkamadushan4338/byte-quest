import { Card } from "@byte-quest/ui/components/card";
import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";
import { cn } from "@byte-quest/ui/lib/utils";

import { partnerTiers, tiersSection } from "./data";

export const Tiers = () => (
  <Section id="tiers">
    <Container>
      <SectionHeader
        kicker={tiersSection.kicker}
        kickerTone="gold"
        lead={tiersSection.lead}
        title={tiersSection.title}
      />

      <div
        className="mt-14 grid gap-3"
        style={{
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))",
        }}
      >
        {partnerTiers.map((tier) => (
          <Card
            className="flex flex-col gap-5 rounded-[18px] p-[22px]"
            key={tier.name}
            style={{ background: tier.background, borderColor: tier.border }}
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className={cn(
                  "font-mono text-[11px] tracking-[0.18em]",
                  tier.accentText
                )}
              >
                {tier.label}
              </span>
              <span
                aria-hidden="true"
                className="size-2.5 rotate-45"
                style={{
                  background: tier.accent,
                  boxShadow: `0 0 14px ${tier.accent}`,
                }}
              />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-muted-2 font-mono text-[11px]">LKR</span>
              <span className="font-display text-[clamp(30px,2.6vw,38px)] font-semibold tracking-[-0.03em]">
                {tier.amount}
              </span>
            </div>

            <a
              className={cn(
                "border-line-soft text-fg-dim mt-auto flex items-center justify-between border-t pt-4 text-[13.5px] font-semibold transition-colors",
                tier.accentHover
              )}
              href="#enquire"
            >
              {tier.cta}
            </a>
          </Card>
        ))}
      </div>
    </Container>
  </Section>
);
