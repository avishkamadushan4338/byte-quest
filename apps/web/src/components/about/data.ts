import type { BreadcrumbItem } from "@byte-quest/ui/components/breadcrumb";

export type AccentTone = "teal" | "volt" | "lime" | "gold" | "mint";

export interface PhilosophyWord {
  n: string;
  label: string;
  color: string;
}

export interface VisionMissionCard {
  id: string;
  kicker: string;
  tone: AccentTone;
  copy: string;
  background: string;
  border: string;
  glow: string;
}

export interface Objective {
  n: string;
  title: string;
  description: string;
}

export interface ParticipationStat {
  label: string;
  value: string;
  hint: string;
  tone: AccentTone;
}

export type GainTone = "volt" | "gold" | "teal" | "mint";

export interface Gain {
  id: string;
  title: string;
  description: string;
  tone: GainTone;
}

export const aboutBreadcrumb: BreadcrumbItem[] = [
  { label: "Home", to: "/" },
  { label: "About" },
];

export const aboutLead =
  "BYTE QUEST is an inter-school innovation and coding programme: a three-month accelerator where students learn, experiment, build, receive mentorship and turn ideas into meaningful technology solutions.";

export const philosophyWords: PhilosophyWord[] = [
  { n: "01", label: "Learn.", color: "#00A99A" },
  { n: "02", label: "Build.", color: "#52FF3D" },
  { n: "03", label: "Innovate.", color: "#B7F000" },
  { n: "04", label: "Inspire.", color: "#F0D875" },
];

export const visionMission: VisionMissionCard[] = [
  {
    id: "vision",
    kicker: "VISION",
    tone: "volt",
    copy: "A generation of Sri Lankan students who use technology to solve real problems.",
    background: "linear-gradient(160deg,#0a2a20,#030f0b)",
    border: "rgba(82,255,61,0.18)",
    glow: "rgba(82,255,61,0.18)",
  },
  {
    id: "mission",
    kicker: "MISSION",
    tone: "gold",
    copy: "To help students learn, build, innovate and inspire through a structured, mentored innovation journey.",
    background: "linear-gradient(160deg,#1a190c,#030f0b)",
    border: "rgba(212,175,55,0.22)",
    glow: "rgba(212,175,55,0.16)",
  },
];

export const objectives: Objective[] = [
  {
    n: "01",
    title: "Develop future skills",
    description: "Coding, design thinking, UI/UX and problem solving.",
  },
  {
    n: "02",
    title: "Encourage purposeful innovation",
    description: "Senior teams innovate for the Sustainable Development Goals.",
  },
  {
    n: "03",
    title: "Make learning creative",
    description:
      "Junior teams build games and apps that make learning fun or solve daily problems.",
  },
  {
    n: "04",
    title: "Connect students with mentors",
    description: "Guidance and reviews throughout all three phases.",
  },
  {
    n: "05",
    title: "Build teamwork and communication",
    description: "Storytelling, pitching and presentation skills.",
  },
  {
    n: "06",
    title: "Showcase student achievement",
    description: "A national stage at the Grand Final Innovation Expo.",
  },
];

export const objectivesLead =
  "To give school students a structured path from curiosity to creation — and a national stage to show what they build.";

export const participationStats: ParticipationStat[] = [
  {
    label: "JUNIOR DIVISION",
    value: "Grades 6–8",
    hint: "Scratch and MIT App Inventor.",
    tone: "mint",
  },
  {
    label: "SENIOR DIVISION",
    value: "Grades 9–13",
    hint: "Web, mobile, Python, AI, IoT, robotics and desktop.",
    tone: "volt",
  },
  {
    label: "TEAM SIZE",
    value: "3–5",
    hint: "Students per team.",
    tone: "teal",
  },
  {
    label: "DURATION",
    value: "12 weeks",
    hint: "Three phases, two hackathons and a Grand Final.",
    tone: "gold",
  },
];

export const gains: Gain[] = [
  {
    id: "technical-skills",
    title: "Technical skills",
    description:
      "Hands-on experience building real software and hardware projects.",
    tone: "volt",
  },
  {
    id: "design-thinking",
    title: "Design thinking",
    description: "Identify problems and design solutions around people.",
    tone: "teal",
  },
  {
    id: "mentorship",
    title: "Mentorship",
    description: "Feedback from experienced mentors at every phase.",
    tone: "gold",
  },
  {
    id: "presentation",
    title: "Presentation",
    description: "Pitch, demo and defend ideas in front of judges.",
    tone: "volt",
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    description: "Understand impact and how ideas become ventures.",
    tone: "mint",
  },
  {
    id: "recognition",
    title: "Recognition",
    description: "Awards and a showcase at the Innovation Expo.",
    tone: "teal",
  },
];

export const gainsLead =
  "Every phase is designed to leave students more capable, more confident and better connected.";

export interface Organiser {
  kicker: string;
  title: string;
  body: string;
  motto: string;
}

export const crestAlt = "St. Aloysius' College crest";

export const presenter = {
  line1: "Presented by St. Aloysius' College, Galle",
  line2: "Old Boys' Association",
};

export const organiser: Organiser = {
  kicker: "PRESENTED BY",
  title: "St. Aloysius' College, Galle — Old Boys' Association",
  body: "BYTE QUEST is organised by the OBA of St. Aloysius' College, Galle. Organising committee details will be published shortly.",
  motto: "CERTA VIRILITER",
};
