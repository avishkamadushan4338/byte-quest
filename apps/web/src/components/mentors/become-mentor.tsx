import { Card } from "@byte-quest/ui/components/card";
import { Container } from "@byte-quest/ui/components/container";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { Section } from "@byte-quest/ui/components/section";
import { Button } from "@byte-quest/ui/primitives/button";

import { becomeMentor, contributions, mentorshipMailto } from "./data";

export const BecomeMentor = () => (
  <Section id="become" tone="impact">
    <Container>
      <Card
        className="border-volt/18 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr))] overflow-hidden rounded-[28px]"
        style={{
          background:
            "radial-gradient(60% 80% at 100% 0%, rgba(82,255,61,0.08), transparent 60%), linear-gradient(160deg,#071d16,#030f0b)",
        }}
      >
        <div className="flex flex-col items-start gap-5 p-[clamp(28px,4vw,48px)]">
          <Kicker tone="volt">{becomeMentor.kicker}</Kicker>
          <h2 className="m-0 text-[clamp(28px,3.2vw,42px)] leading-[1.02] tracking-[-0.035em]">
            {becomeMentor.title}
          </h2>
          <p className="text-muted m-0 max-w-[460px] text-[16px] leading-[1.65]">
            {becomeMentor.body}
          </p>
          <Button
            className="mt-1"
            render={
              <a
                aria-label="Express interest via email"
                href={mentorshipMailto}
              />
            }
            size="lg"
          >
            {becomeMentor.action}
          </Button>
        </div>

        <div className="bg-line-soft border-line-soft grid grid-cols-2 gap-px border-l">
          {contributions.map((item) => (
            <div
              className="flex flex-col gap-2.5 bg-[linear-gradient(160deg,#071d16,#030f0b)] p-[clamp(18px,2.4vw,26px)]"
              key={item.n}
            >
              <span className="text-volt font-mono text-[11px] tracking-[0.14em]">
                {item.n}
              </span>
              <span className="font-display text-[16px] font-semibold tracking-[-0.02em]">
                {item.title}
              </span>
              <span className="text-muted-2 text-[13px] leading-[1.55]">
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </Container>
  </Section>
);
