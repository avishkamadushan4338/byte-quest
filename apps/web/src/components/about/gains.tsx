import { IconChip } from "@byte-quest/ui/components/breadcrumb";
import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";
import {
  HairlineCell,
  HairlineGrid,
} from "@byte-quest/ui/components/stat-strip";

import { gains, gainsLead } from "./data";

export const Gains = () => (
  <Section id="gains">
    <Container>
      <SectionHeader
        kicker="WHAT STUDENTS GAIN"
        lead={gainsLead}
        title="Skills that outlast the programme."
      />

      <HairlineGrid className="mt-12" columns="minmax(min(100%,380px),1fr)">
        {gains.map((gain) => (
          <HairlineCell className="gap-4 p-7" key={gain.id}>
            <IconChip tone={gain.tone} />
            <h3 className="font-display text-[18px] leading-[1.2] tracking-[-0.02em]">
              {gain.title}
            </h3>
            <p className="text-muted-2 m-0 text-[13.5px] leading-[1.55]">
              {gain.description}
            </p>
          </HairlineCell>
        ))}
      </HairlineGrid>
    </Container>
  </Section>
);
