import { useState } from "react";

import { ClosingCta } from "@/components/site/closing-cta";

import { journeyClosing } from "./data";
import type { PhaseFilter } from "./data";
import { JourneyHero } from "./hero";
import { Milestones } from "./milestones";
import { Phases } from "./phases";
import { WeekByWeek } from "./week-by-week";

export const Journey = () => {
  const [phase, setPhase] = useState<PhaseFilter>(0);

  return (
    <main className="bg-ink">
      <JourneyHero />
      <Phases onSelect={setPhase} phase={phase} />
      <WeekByWeek onPhaseChange={setPhase} phase={phase} />
      <Milestones />
      <ClosingCta
        actions={journeyClosing.actions}
        title={journeyClosing.title}
      />
    </main>
  );
};
