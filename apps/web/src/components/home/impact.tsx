import { Container } from "@byte-quest/ui/components/container";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { Section } from "@byte-quest/ui/components/section";

import { impactSteps } from "./data";

export const Impact = () => (
  <Section className="overflow-hidden" id="impact" tone="impact">
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(45% 60% at 20% 50%, rgba(183,240,0,0.08), transparent 70%)",
      }}
    />
    <Container className="relative grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-12 lg:gap-x-[72px]">
      <div>
        <Kicker tone="lime">06 / Innovate for Impact · Senior</Kicker>
        <h2 className="mt-[18px] text-[clamp(38px,5vw,68px)] leading-[0.95] tracking-[-0.04em]">
          Technology with purpose.
        </h2>
        <p className="text-muted mt-[22px] max-w-[480px] text-[17px] leading-[1.65]">
          Senior teams innovate for the UN Sustainable Development Goals —
          turning a real-world problem into a technology solution.
        </p>
      </div>

      <div className="border-line bg-line grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-px overflow-hidden rounded-[20px] border">
        {impactSteps.map((step) => (
          <div
            className="bg-surface flex flex-col gap-2.5 p-[22px]"
            key={step.n}
          >
            <span className="text-lime font-mono text-[11px] tracking-[0.12em]">
              {step.n}
            </span>
            <div className="font-display text-[20px] font-semibold tracking-[-0.01em]">
              {step.title}
            </div>
            <div className="text-muted-2 text-[13.5px] leading-[1.5]">
              {step.description}
            </div>
          </div>
        ))}
      </div>
    </Container>
  </Section>
);
