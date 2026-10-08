import type { Fact } from "@/components/site/fact-strip";

export interface Phase {
  n: string;
  weeks: string;
  title: string;
  color: string;
  items: string;
  milestone: string;
  milestoneColor: string;
}

export interface MilestoneRow {
  label: string;
  value: string;
}

export interface Milestone {
  kicker: string;
  week: string;
  title: string;
  color: string;
  line: string;
  tint: string;
  flow: string[];
  description: string;
  rows: MilestoneRow[];
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

export const programmeLead =
  "BYTE QUEST is a three-month inter-school innovation and coding programme. Teams learn, build and present technology solutions - guided by mentors, tested at two hackathons, and celebrated at the Grand Final.";

export const programmeFacts: Fact[] = [
  { label: "FORMAT", value: "Accelerator", color: "#F2F7F4" },
  { label: "DURATION", value: "3 months", color: "#F2F7F4" },
  { label: "DIVISIONS", value: "Junior · Senior", color: "#00A99A" },
  { label: "TEAM SIZE", value: "3–5", color: "#B7F000" },
  { label: "GRADES", value: "6–13", color: "#F0D875" },
];

export const structureLead =
  "Each phase builds on the last, with workshops, mentor reviews and a clear milestone to aim for.";

export const phases: Phase[] = [
  {
    n: "01",
    weeks: "WEEKS 1–4",
    title: "Innovation Foundation",
    color: "#00A99A",
    items:
      "Orientation, team formation, design thinking, problem identification, SDG awareness and project planning.",
    milestone: "Mentor review",
    milestoneColor: "#00A99A",
  },
  {
    n: "02",
    weeks: "WEEKS 5–8",
    title: "Development",
    color: "#52FF3D",
    items: "UI/UX, coding, mentoring and prototype development.",
    milestone: "Hackathon 01",
    milestoneColor: "#B7F000",
  },
  {
    n: "03",
    weeks: "WEEKS 9–12",
    title: "Refinement",
    color: "#D4AF37",
    items:
      "Testing, debugging, presentation, entrepreneurship, mock judging and final improvements.",
    milestone: "Hackathon 02 · Final",
    milestoneColor: "#F0D875",
  },
];

export const milestones: Milestone[] = [
  {
    kicker: "HACKATHON 01",
    week: "06",
    title: "Innovation Challenge",
    color: "#00A99A",
    line: "rgba(0,169,154,0.35)",
    tint: "rgba(0,169,154,0.12)",
    flow: ["Idea", "Problem", "Concept", "Prototype"],
    description:
      "Teams turn the problem they identified in Phase 01 into a clear concept and early prototype.",
    rows: [
      {
        label: "PURPOSE",
        value: "Validate the idea and the problem it solves.",
      },
      {
        label: "DELIVERABLES",
        value: "Published with the official challenge brief.",
      },
      { label: "JUDGING", value: "Criteria published before the event." },
      { label: "QUALIFICATION", value: "Details to be announced." },
    ],
  },
  {
    kicker: "HACKATHON 02",
    week: "11",
    title: "Prototype Challenge",
    color: "#52FF3D",
    line: "rgba(82,255,61,0.32)",
    tint: "rgba(82,255,61,0.09)",
    flow: ["Build", "Test", "Present", "Improve"],
    description:
      "Teams present a working prototype, demo it, and use feedback to make final improvements.",
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
    kicker: "GRAND FINAL",
    week: "12",
    title: "Innovation Expo",
    color: "#D4AF37",
    line: "rgba(212,175,55,0.4)",
    tint: "rgba(212,175,55,0.12)",
    flow: ["Showcase", "Judge", "Celebrate", "Inspire"],
    description:
      "Finalists exhibit, present and demo their projects at the Inter School Innovation Expo.",
    rows: [
      { label: "EXHIBITION", value: "Project showcase for finalists." },
      { label: "FINAL JUDGING", value: "Presentations and live demos." },
      { label: "AWARDS", value: "Champion, runners-up and special awards." },
      {
        label: "CEREMONY",
        value: "Sponsor recognition and closing ceremony.",
      },
    ],
  },
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

export const mainAwards = ["Champion", "1st Runner-Up", "2nd Runner-Up"];

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
    n: "01",
    text: "Teams register through their school, with a teacher in charge.",
  },
  { n: "02", text: "Each team has 3–5 students." },
  { n: "03", text: "All members must be in the grades for their division." },
  {
    n: "04",
    text: "Teams follow the BYTE QUEST code of conduct throughout.",
  },
  { n: "05", text: "Projects must be the original work of the team." },
];

export const rulesFootnote =
  "Full rules and submission guidelines will be published in Resources.";
