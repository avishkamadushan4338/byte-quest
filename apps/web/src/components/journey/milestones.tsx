import { Badge } from "@byte-quest/ui/components/badge";
import { Card } from "@byte-quest/ui/components/card";
import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";

import { milestones } from "./data";

export const Milestones = () => (
  <Section id="milestones" tone="impact">
    <Container>
      <SectionHeader
        kicker="MAJOR MILESTONES"
        title="Three moments that matter."
      />

      <div className="mt-14 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
        {milestones.map((item) => (
          <Card
            className="flex flex-col gap-6 p-[26px]"
            key={item.week}
            style={{
              background: `linear-gradient(180deg,${item.tint},transparent 60%),#030f0b`,
              borderColor: item.line,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className="font-mono text-[11px] tracking-[0.16em]"
                style={{ color: item.accent }}
              >
                {item.week}
              </span>
              <Badge tone="gold">DATE TBA</Badge>
            </div>

            <div>
              <div
                className="font-mono text-[10.5px] tracking-[0.14em]"
                style={{ color: item.accent }}
              >
                {item.label}
              </div>
              <h3 className="mt-2 text-[24px] leading-[1.1] tracking-[-0.025em]">
                {item.title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px]">
              {item.flow.map((step, index) => (
                <span
                  className="flex items-center gap-2 whitespace-nowrap"
                  key={step}
                >
                  {index > 0 ? (
                    <span aria-hidden="true" style={{ color: item.accent }}>
                      →
                    </span>
                  ) : null}
                  <span className="text-muted">{step}</span>
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Container>
  </Section>
);
