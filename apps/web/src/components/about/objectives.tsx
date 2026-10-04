import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";

import { objectives, objectivesLead } from "./data";

export const Objectives = () => (
  <Section id="objectives">
    <Container>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-[72px]">
        <div className="lg:sticky lg:top-[110px] lg:self-start">
          <SectionHeader
            kicker="OBJECTIVES"
            kickerTone="teal"
            lead={objectivesLead}
            title="Why BYTE QUEST exists."
          />
        </div>

        <div className="border-line-soft border-t">
          {objectives.map((objective) => (
            <div
              className="border-line-soft grid grid-cols-[56px_1fr] gap-x-4 border-b py-[22px]"
              key={objective.n}
            >
              <span className="text-volt font-mono text-[12px] tracking-[0.12em]">
                {objective.n}
              </span>
              <div>
                <h3 className="font-display text-[20px] leading-[1.2] tracking-[-0.02em]">
                  {objective.title}
                </h3>
                <p className="text-muted-2 m-0 mt-1.5 text-[14.5px] leading-[1.55]">
                  {objective.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  </Section>
);
