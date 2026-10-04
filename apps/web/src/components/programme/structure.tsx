import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";
import {
  HairlineCell,
  HairlineGrid,
} from "@byte-quest/ui/components/stat-strip";

import { phases, structureLead } from "./data";

export const Structure = () => (
  <Section id="phases">
    <Container>
      <SectionHeader
        kicker="HOW IT WORKS"
        lead={structureLead}
        title="Three phases, one continuous journey."
      />

      <HairlineGrid
        className="border-line-soft mt-12 border"
        columns="minmax(min(100%,300px),1fr)"
      >
        {phases.map((phase) => (
          <HairlineCell className="relative gap-4 p-7 pb-0" key={phase.id}>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{ background: phase.color }}
            />

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span
                className="font-mono text-[11px] tracking-[0.14em]"
                style={{ color: phase.color }}
              >
                PHASE {phase.n}
              </span>
              <span className="text-muted-2 font-mono text-[11px] tracking-[0.14em]">
                {phase.weeks}
              </span>
            </div>

            <h3 className="font-display text-[24px] leading-[1.1] tracking-[-0.025em]">
              {phase.title}
            </h3>

            <p className="text-muted m-0 text-[14px] leading-[1.55]">
              {phase.body}
            </p>

            <div className="border-line-soft mt-auto flex items-center justify-between gap-3 border-t py-4">
              <span className="text-faint font-mono text-[10.5px] tracking-[0.14em] uppercase">
                Milestone
              </span>
              <span
                className="font-mono text-[11.5px] tracking-[0.06em]"
                style={{ color: phase.milestoneColor }}
              >
                {phase.milestone}
              </span>
            </div>
          </HairlineCell>
        ))}
      </HairlineGrid>
    </Container>
  </Section>
);
