import type { BreadcrumbItem } from "@byte-quest/ui/components/breadcrumb";

export interface ProgrammeStat {
  label: string;
  value: string;
  tone?: "default" | "teal" | "volt" | "lime" | "gold" | "mint";
}

export interface Phase {
  id: string;
  n: string;
  weeks: string;
  title: string;
  body: string;
  color: string;
  milestone: string;
  milestoneColor: string;
}

export interface MilestoneRow {
  label: string;
  value: string;
}

export interface Milestone {
  id: string;
  label: string;
  week: string;
  title: string;
  description: string;
  flow: string[];
  accent: string;
  glow: string;
  rows: MilestoneRow[];
}

export interface ComparisonHead {
  label: string;
  name: string;
  color: string;
}

export interface ComparisonRow {
  label: string;
  junior: string;
  senior: string;
}

export interface Rule {
  n: string;
  text: string;
}

export const programmeBreadcrumb: BreadcrumbItem[] = [
  { label: "Home", to: "/" },
  { label: "Programme" },
];

export const programmeLead =
  "BYTE QUEST is a three-month inter-school innovation and coding programme. Teams learn, build and present technology solutions — guided by mentors, tested at two hackathons, and celebrated at the Grand Final.";

export const programmeStats: ProgrammeStat[] = [
  { label: "FORMAT", value: "Accelerator" },
  { label: "DURATION", value: "3 months" },
  { label: "DIVISIONS", value: "Junior · Senior", tone: "teal" },
  { label: "TEAM SIZE", value: "3–5", tone: "lime" },
  { label: "GRADES", value: "6–13", tone: "gold" },
];

export const phases: Phase[] = [
  {
    id: "phase-01",
    n: "01",
    weeks: "WEEKS 1–4",
    title: "Innovation Foundation",
    body: "Orientation, team formation, design thinking, problem identification, SDG awareness and project planning.",
    color: "#00A99A",
    milestone: "Mentor review",
    milestoneColor: "#00A99A",
  },
  {
    id: "phase-02",
    n: "02",
    weeks: "WEEKS 5–8",
    title: "Development",
    body: "UI/UX, coding, mentoring and prototype development.",
    color: "#52FF3D",
    milestone: "Hackathon 01",
    milestoneColor: "#B7F000",
  },
  {
    id: "phase-03",
    n: "03",
    weeks: "WEEKS 9–12",
    title: "Refinement",
    body: "Testing, debugging, presentation, entrepreneurship, mock judging and final improvements.",
    color: "#D4AF37",
    milestone: "Hackathon 02 · Final",
    milestoneColor: "#F0D875",
  },
];

export const structureLead =
  "Each phase builds on the last, with workshops, mentor reviews and a clear milestone to aim for.";

export const milestones: Milestone[] = [
  {
    id: "hackathon-01",
    label: "HACKATHON 01",
    week: "06",
    title: "Innovation Challenge",
    description:
      "Teams turn the problem they identified in Phase 01 into a clear concept and early prototype.",
    flow: ["Idea", "Problem", "Concept", "Prototype"],
    accent: "#00A99A",
    glow: "rgba(0,169,154,0.14)",
    rows: [
      {
        label: "PURPOSE",
        value: "Validate the idea and the problem it solves.",
      },
      {
        label: "DELIVERABLES",
        value: "Published with the official challenge brief.",
      },
      {
        label: "JUDGING",
        value: "Criteria published before the event.",
      },
      { label: "QUALIFICATION", value: "Details to be announced." },
    ],
  },
  {
    id: "hackathon-02",
    label: "HACKATHON 02",
    week: "11",
    title: "Prototype Challenge",
    description:
      "Teams present a working prototype, demo it, and use feedback to make final improvements.",
    flow: ["Build", "Test", "Present", "Improve"],
    accent: "#52FF3D",
    glow: "rgba(82,255,61,0.12)",
    rows: [
      { label: "PURPOSE", value: "Demonstrate a working, tested prototype." },
      {
        label: "DELIVERABLES",
        value: "Published with the official challenge brief.",
      },
      { label: "PRESENTATION", value: "Demo and pitch to judges." },
      { label: "JUDGING", value: "Criteria published before the event." },
    ],
  },
  {
    id: "grand-final",
    label: "GRAND FINAL",
    week: "12",
    title: "Innovation Expo",
    description:
      "Finalists exhibit, present and demo their projects at the Inter School Innovation Expo.",
    flow: ["Showcase", "Judge", "Celebrate", "Inspire"],
    accent: "#D4AF37",
    glow: "rgba(212,175,55,0.14)",
    rows: [
      { label: "EXHIBITION", value: "Project showcase for finalists." },
      { label: "FINAL JUDGING", value: "Presentations and live demos." },
      { label: "AWARDS", value: "Champion, runners-up and special awards." },
      { label: "CEREMONY", value: "Sponsor recognition and closing ceremony." },
    ],
  },
];

export const divisionHeads: ComparisonHead[] = [
  { label: "DIVISION A", name: "Junior", color: "#B9F5D0" },
  { label: "DIVISION B", name: "Senior", color: "#52FF3D" },
];

export const comparisonRows: ComparisonRow[] = [
  { label: "GRADES", junior: "Grades 6–8", senior: "Grades 9–13" },
  {
    label: "CHALLENGE",
    junior:
      "Create a game or application that makes learning fun or solves a daily problem.",
    senior: "Innovate for the Sustainable Development Goals.",
  },
  {
    label: "FOCUS",
    junior: "Creativity, problem solving, learning, experimentation",
    senior:
      "Technology, innovation, sustainability, real-world problem solving",
  },
  {
    label: "PLATFORMS",
    junior: "Scratch, MIT App Inventor",
    senior: "Web, mobile, Python, AI, IoT, robotics, desktop",
  },
  { label: "TEAM SIZE", junior: "3–5 students", senior: "3–5 students" },
];

export const podiumPlaces = ["Champion", "1st Runner-Up", "2nd Runner-Up"];

export const specialAwards = [
  "Best Creativity",
  "Best Coding",
  "Best Educational Project",
  "Best SDG Impact",
  "Best Innovation",
  "Best Technical Solution",
  "Best Sustainability Project",
  "Best Presenter",
];

export const keyRules: Rule[] = [
  {
    n: "1",
    text: "Teams register through their school, with a teacher in charge.",
  },
  { n: "2", text: "Each team has 3–5 students." },
  { n: "3", text: "All members must be in the grades for their division." },
  { n: "4", text: "Teams follow the BYTE QUEST code of conduct throughout." },
  { n: "5", text: "Projects must be the original work of the team." },
];

export const rulesFootnoteLead =
  "Full rules and submission guidelines will be published in";

export const rulesFootnoteLink = "Resources";
