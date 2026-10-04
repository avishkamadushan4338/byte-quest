import type { StatItem } from "@byte-quest/ui/components/stat-strip";

import {
  milestoneWeeks,
  moments,
  phases as programmePhases,
  weeks as programmeWeeks,
} from "@/components/home/data";

export type PhaseIndex = 1 | 2 | 3;
export type PhaseFilter = 0 | PhaseIndex;

export interface ClosingAction {
  label: string;
  to: string;
  variant?: "primary" | "outline";
}

export interface JourneyClosing {
  title: string;
  actions: ClosingAction[];
}

export interface JourneyPhase {
  index: PhaseIndex;
  n: string;
  weeks: string;
  title: string;
  accent: string;
  line: string;
  items: string[];
}

export interface TimelineWeek {
  week: number;
  n: string;
  title: string;
  phase: PhaseIndex;
  phaseLabel: string;
  accent: string;
  milestone?: string;
}

export interface Milestone {
  week: string;
  label: string;
  title: string;
  accent: string;
  tint: string;
  line: string;
  flow: string[];
}

const phaseIndexes: PhaseIndex[] = [1, 2, 3];

const phaseLabels = ["FOUNDATION", "DEVELOPMENT", "REFINEMENT"];

const milestoneTints = [
  "rgba(0,169,154,0.08)",
  "rgba(82,255,61,0.06)",
  "rgba(212,175,55,0.08)",
];

const milestoneLines = [
  "rgba(0,169,154,0.3)",
  "rgba(82,255,61,0.28)",
  "rgba(212,175,55,0.35)",
];

export const journeyStats: StatItem[] = [
  { label: "DURATION", value: "12 weeks" },
  { label: "PHASES", value: "3", tone: "teal" },
  { label: "HACKATHONS", value: "2", tone: "lime" },
  { label: "GRAND FINAL", value: "Week 12", tone: "gold" },
];

export const journeyPhases: JourneyPhase[] = programmePhases.map(
  (phase, index) => ({
    index: phaseIndexes[index],
    n: phase.n,
    weeks: phase.weeks,
    title: phase.title,
    accent: phase.color,
    line: phase.line,
    items: phase.items,
  })
);

export const phaseFilters = ["ALL", "PHASE 01", "PHASE 02", "PHASE 03"];

const phaseOfWeek = (week: number): PhaseIndex => {
  if (week <= 4) {
    return 1;
  }
  if (week <= 8) {
    return 2;
  }
  return 3;
};

const milestoneLabels: Record<number, string | undefined> = {
  6: moments[0].kicker,
  11: moments[1].kicker,
  12: moments[2].kicker,
};

export const timelineWeeks: TimelineWeek[] = programmeWeeks.map(
  (title, index) => {
    const week = index + 1;
    const phase = phaseOfWeek(week);

    return {
      week,
      n: String(week).padStart(2, "0"),
      title,
      phase,
      phaseLabel: phaseLabels[phase - 1],
      accent: journeyPhases[phase - 1].accent,
      milestone: milestoneLabels[week],
    };
  }
);

export const milestones: Milestone[] = moments.map((moment, index) => ({
  week: `WEEK ${String(milestoneWeeks[index]).padStart(2, "0")}`,
  label: moment.kicker,
  title: moment.title,
  accent: moment.accent,
  tint: milestoneTints[index],
  line: milestoneLines[index],
  flow: moment.flow,
}));

export const journeyClosing: JourneyClosing = {
  title: "Your journey starts with a team.",
  actions: [
    { label: "Register your team →", to: "/register" },
    { label: "About BYTE QUEST", to: "/about", variant: "outline" },
  ],
};
