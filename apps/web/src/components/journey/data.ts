import type { Fact } from "@/components/site/fact-strip";

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
  short: string;
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
  line: string;
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

export const journeyFacts: Fact[] = [
  { label: "DURATION", value: "12 weeks", color: "#F2F7F4" },
  { label: "PHASES", value: "3", color: "#00A99A" },
  { label: "HACKATHONS", value: "2", color: "#B7F000" },
  { label: "GRAND FINAL", value: "Week 12", color: "#F0D875" },
];

export const journeyPhases: JourneyPhase[] = [
  {
    index: 1,
    n: "01",
    weeks: "WEEKS 1–4",
    title: "Innovation Foundation",
    short: "FOUNDATION",
    accent: "#00A99A",
    line: "rgba(0,169,154,0.5)",
    items: [
      "Orientation",
      "Team Formation",
      "Design Thinking",
      "Problem Identification",
      "SDG Awareness",
      "Project Planning",
    ],
  },
  {
    index: 2,
    n: "02",
    weeks: "WEEKS 5–8",
    title: "Development",
    short: "DEVELOPMENT",
    accent: "#52FF3D",
    line: "rgba(82,255,61,0.5)",
    items: ["UI/UX", "Coding", "Mentoring", "Prototype Development"],
  },
  {
    index: 3,
    n: "03",
    weeks: "WEEKS 9–12",
    title: "Refinement",
    short: "REFINEMENT",
    accent: "#D4AF37",
    line: "rgba(212,175,55,0.55)",
    items: [
      "Testing",
      "Debugging",
      "Presentation",
      "Entrepreneurship",
      "Mock Judging",
      "Final Improvements",
    ],
  },
];

export const phaseFilters = ["ALL", "PHASE 01", "PHASE 02", "PHASE 03"];

const weekTitles = [
  "Opening Ceremony & Team Formation",
  "Innovation & Design Thinking",
  "Project Planning & SDG Mapping",
  "Technical Workshop + Mentor Review",
  "UI/UX Design",
  "Hackathon 1",
  "Storytelling & Pitching",
  "Prototype Review",
  "Testing & Debugging",
  "Entrepreneurship & Impact",
  "Hackathon 2 + Final Improvements",
  "Grand Final",
];

const milestoneLabels: Record<number, string | undefined> = {
  6: "HACKATHON 01",
  11: "HACKATHON 02",
  12: "GRAND FINAL",
};

const phaseOfWeek = (week: number): PhaseIndex => {
  if (week <= 4) {
    return 1;
  }
  if (week <= 8) {
    return 2;
  }
  return 3;
};

export const timelineWeeks: TimelineWeek[] = weekTitles.map((title, index) => {
  const week = index + 1;
  const phase = phaseOfWeek(week);
  const source = journeyPhases[phase - 1];
  return {
    week,
    n: String(week).padStart(2, "0"),
    title,
    phase,
    phaseLabel: source.short,
    accent: source.accent,
    line: source.line,
    milestone: milestoneLabels[week],
  };
});

export const milestones: Milestone[] = [
  {
    week: "WEEK 06",
    label: "HACKATHON 01",
    title: "Innovation Challenge",
    accent: "#00A99A",
    line: "rgba(0,169,154,0.3)",
    tint: "rgba(0,169,154,0.08)",
    flow: ["Idea", "Problem", "Concept", "Prototype"],
  },
  {
    week: "WEEK 11",
    label: "HACKATHON 02",
    title: "Prototype Challenge",
    accent: "#52FF3D",
    line: "rgba(82,255,61,0.28)",
    tint: "rgba(82,255,61,0.06)",
    flow: ["Build", "Test", "Present", "Improve"],
  },
  {
    week: "WEEK 12",
    label: "GRAND FINAL",
    title: "Innovation Expo",
    accent: "#D4AF37",
    line: "rgba(212,175,55,0.35)",
    tint: "rgba(212,175,55,0.08)",
    flow: ["Showcase", "Judge", "Celebrate", "Inspire"],
  },
];

export const journeyClosing: JourneyClosing = {
  title: "Your journey starts with a team.",
  actions: [
    { label: "Register your team →", to: "/register" },
    { label: "About BYTE QUEST", to: "/about", variant: "outline" },
  ],
};
