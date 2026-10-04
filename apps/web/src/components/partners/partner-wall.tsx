import { Card } from "@byte-quest/ui/components/card";
import { Container } from "@byte-quest/ui/components/container";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { Section } from "@byte-quest/ui/components/section";
import { cn } from "@byte-quest/ui/lib/utils";

import { partnerTiers, partnerWall } from "./data";

export const PartnerWall = () => (
  <Section id="partners-wall" tone="alt">
    <Container>
      <Kicker tone="faint">{partnerWall.kicker}</Kicker>

      <div className="mt-8 grid gap-3">
        {partnerTiers.map((tier) => (
          <Card
            className="grid [grid-template-columns:120px_1fr] gap-4 rounded-[16px] p-3.5"
            key={tier.name}
          >
            <span
              className={cn(
                "font-mono text-[11px] tracking-[0.18em]",
                tier.accentText
              )}
            >
              {tier.label}
            </span>

            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
              }}
            >
              {Array.from({ length: tier.slots }, (_, slot) => (
                <div
                  className={cn(
                    "border-line-soft text-faint-2 flex items-center justify-center rounded-[10px] border border-dashed font-mono text-[10px] tracking-[0.1em]",
                    tier.slotHeight
                  )}
                  key={slot}
                >
                  LOGO · TBA
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Container>
  </Section>
);
