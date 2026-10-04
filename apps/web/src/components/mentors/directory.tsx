import { Badge } from "@byte-quest/ui/components/badge";
import { Card } from "@byte-quest/ui/components/card";
import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { TabsList, TabsRoot, TabsTab } from "@byte-quest/ui/primitives/tabs";
import { useState } from "react";

import { directoryNote, expertiseFilters, mentors, pending } from "./data";

export const Directory = () => {
  const [activeFilter, setActiveFilter] = useState(0);

  const selected = expertiseFilters[activeFilter];
  const visibleMentors = mentors.filter(
    (mentor) => selected === "ALL" || mentor.categories.includes(selected)
  );

  return (
    <Section
      className="pt-[clamp(32px,4vw,52px)]"
      id="mentors-directory"
      tone="base"
    >
      <Container>
        <TabsRoot
          onValueChange={(value) => {
            setActiveFilter(Number(value));
          }}
          value={String(activeFilter)}
        >
          <TabsList aria-label="Expertise">
            {expertiseFilters.map((filter, index) => (
              <TabsTab key={filter} value={String(index)}>
                {filter}
              </TabsTab>
            ))}
          </TabsList>
        </TabsRoot>

        <div className="mt-8 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
          {visibleMentors.map((mentor) => (
            <Card
              className="hover:border-volt/35 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              key={mentor.id}
            >
              <div className="relative flex aspect-[4/3] items-center justify-center bg-[repeating-linear-gradient(135deg,#061c16_0_10px,#04140f_10px_20px)]">
                <span className="text-faint-2 font-mono text-[10.5px] tracking-[0.1em]">
                  MENTOR PHOTO
                </span>
                <Badge className="absolute top-3 left-3" tone="volt">
                  {mentor.category}
                </Badge>
              </div>

              <div className="grid gap-3 p-[18px]">
                <div className="font-display text-muted text-[18px] font-semibold">
                  {mentor.name}
                </div>
                <div className="grid gap-2 text-[13px]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-faint">Role</span>
                    <span className="text-muted-2 text-right">
                      {mentor.role || pending}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-faint">Organisation</span>
                    <span className="text-muted-2 text-right">
                      {mentor.organisation || pending}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="border-line-fg/20 text-muted mt-4 rounded-[14px] border border-dashed px-5 py-4 text-[14px]">
          {directoryNote}
        </div>
      </Container>
    </Section>
  );
};
