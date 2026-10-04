import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";
import { StatStrip } from "@byte-quest/ui/components/stat-strip";

import { participationStats } from "./data";

export const Divisions = () => (
  <Section id="schools" tone="schools">
    <Container>
      <SectionHeader
        kicker="WHO CAN PARTICIPATE"
        title="School teams, two divisions."
      />

      <StatStrip
        className="mt-12 rounded-[18px] [&>div]:p-6"
        columns="minmax(min(100%,260px),1fr)"
        items={participationStats}
        valueClassName="text-[clamp(32px,3vw,42px)]"
      />
    </Container>
  </Section>
);
