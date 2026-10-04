import { Badge } from "@byte-quest/ui/components/badge";
import { Card } from "@byte-quest/ui/components/card";
import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";
import { DefinitionTable } from "@byte-quest/ui/components/table";
import {
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from "@byte-quest/ui/primitives/tabs";
import { useState } from "react";

import { milestones } from "./data";

export const Milestones = () => {
  const [activeId, setActiveId] = useState(milestones[0].id);

  return (
    <Section id="timeline" tone="alt">
      <Container>
        <SectionHeader
          kicker="THE THREE BIG MOMENTS"
          kickerTone="gold"
          title="Two hackathons. One grand finale."
        />

        <TabsRoot
          className="mt-12"
          onValueChange={(value) => setActiveId(String(value))}
          value={activeId}
        >
          <TabsList>
            {milestones.map((milestone) => (
              <TabsTab
                className="data-selected:bg-volt/12 data-selected:text-fg flex flex-col items-start gap-1.5 px-5 py-3.5 text-left"
                key={milestone.id}
                value={milestone.id}
              >
                <span
                  className="font-mono text-[11px] tracking-[0.12em] whitespace-nowrap"
                  style={{ color: milestone.accent }}
                >
                  {milestone.label} · WEEK {milestone.week}
                </span>
                <span className="font-display text-[20px] tracking-[-0.02em] normal-case">
                  {milestone.title}
                </span>
              </TabsTab>
            ))}
          </TabsList>

          {milestones.map((milestone) => (
            <TabsPanel key={milestone.id} value={milestone.id}>
              <Card
                className="rounded-2xl p-[clamp(22px,3.5vw,40px)]"
                style={{
                  background: `radial-gradient(70% 90% at 100% 0%, ${milestone.glow}, transparent 65%), #030F0B`,
                  border: `1px solid ${milestone.accent}22`,
                }}
              >
                <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[clamp(24px,3vw,44px)]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className="font-mono text-[11px] tracking-[0.14em]"
                        style={{ color: milestone.accent }}
                      >
                        {milestone.label} · WEEK {milestone.week}
                      </span>
                      <Badge tone="gold">DATE TBA</Badge>
                    </div>

                    <h3 className="font-display mt-5 text-[clamp(30px,3.4vw,44px)] leading-[1.02] tracking-[-0.035em]">
                      {milestone.title}
                    </h3>

                    <p className="text-muted m-0 mt-4 max-w-[460px] text-[15.5px] leading-[1.6]">
                      {milestone.description}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[14px]">
                      {milestone.flow.map((step, index) => (
                        <span
                          className="inline-flex items-center gap-2 whitespace-nowrap"
                          key={step}
                        >
                          {index > 0 ? (
                            <span
                              aria-hidden="true"
                              style={{ color: milestone.accent }}
                            >
                              →
                            </span>
                          ) : null}
                          <span className="text-fg-dim">{step}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <DefinitionTable
                    className="self-center"
                    labelWidth="150px"
                    rows={milestone.rows}
                  />
                </div>
              </Card>
            </TabsPanel>
          ))}
        </TabsRoot>
      </Container>
    </Section>
  );
};
