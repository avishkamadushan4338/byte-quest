import { Card } from "@byte-quest/ui/components/card";
import { Container } from "@byte-quest/ui/components/container";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { Section } from "@byte-quest/ui/components/section";

import { visionMission } from "./data";

export const VisionMission = () => (
  <Section id="vision">
    <Container>
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-4">
        {visionMission.map((card) => (
          <Card
            className="relative overflow-hidden rounded-2xl p-[clamp(26px,3.5vw,44px)]"
            key={card.id}
            style={{
              background: card.background,
              border: `1px solid ${card.border}`,
            }}
            variant="raised"
          >
            <span
              aria-hidden="true"
              className="absolute top-[-80px] right-[-80px] size-[260px] rounded-full"
              style={{
                background: `radial-gradient(circle, ${card.glow}, transparent 70%)`,
              }}
            />
            <div className="relative">
              <Kicker tone={card.tone}>{card.kicker}</Kicker>
              <p className="font-display mt-6 text-[clamp(22px,2.2vw,30px)] leading-[1.25]">
                {card.copy}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  </Section>
);
