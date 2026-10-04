import { Card } from "@byte-quest/ui/components/card";
import { Container } from "@byte-quest/ui/components/container";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { Section } from "@byte-quest/ui/components/section";

import { crestAlt, organiser } from "./data";

const CREST_SRC = "/assets/crest.png";

export const Organisers = () => (
  <Section id="organisers" tone="gold">
    <Container>
      <Card
        className="grid gap-10 rounded-[28px] p-[clamp(26px,3.5vw,44px)] lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-[56px]"
        style={{
          background:
            "radial-gradient(60% 80% at 0% 0%, rgba(212,175,55,0.1), transparent 60%), linear-gradient(160deg,#071d16,#030f0b)",
          border: "1px solid rgba(212,175,55,0.24)",
        }}
      >
        <img
          alt={crestAlt}
          className="w-[min(220px,60%)] drop-shadow-[0_10px_40px_rgba(212,175,55,0.35)]"
          src={CREST_SRC}
        />

        <div>
          <Kicker tone="gold">{organiser.kicker}</Kicker>
          <h2 className="mt-5 text-[clamp(28px,3.2vw,44px)] leading-[1.02] tracking-[-0.04em]">
            {organiser.title}
          </h2>
          <p className="text-muted mt-5 max-w-[560px] text-[16px] leading-[1.6]">
            {organiser.body}
          </p>
          <div className="text-gold-bright mt-7 font-mono text-[12px] tracking-[0.24em]">
            {organiser.motto}
          </div>
        </div>
      </Card>
    </Container>
  </Section>
);
