export interface PhilosophyWord {
  n: string;
  label: string;
  color: string;
}

export interface VisionMissionCard {
  id: string;
  kicker: string;
  color: string;
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

export interface EligibilityDivision {
  kicker: string;
  title: string;
  grades: string;
  color: string;
  line: string;
  glow: string;
  shadow: string;
  background: string;
  chipBackground: string;
  chipLine: string;
  gradeClass: string;
  challenge: string;
  platforms: string[];
}

export interface EligibilitySpec {
  value: string;
  kicker: string;
  description: string;
  color: string;
}

export interface Gain {
  id: string;
  n: string;
  title: string;
  description: string;
  color: string;
  tint: string;
  line: string;
  shadow: string;
  strokeClass: string;
  hoverBorder: string;
  hoverShadow: string;
}

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
    color: "#52FF3D",
    copy: "A generation of Sri Lankan students who use technology to solve real problems.",
    background: "linear-gradient(160deg,#0a2a20,#030f0b)",
    border: "rgba(82,255,61,0.18)",
    glow: "rgba(82,255,61,0.18)",
  },
  {
    id: "mission",
    kicker: "MISSION",
    color: "#F0D875",
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

export const eligibilityLead =
  "Every student in Grades 6–13 has a place. Teams compete within the division that matches their grades.";

export const eligibilityDivisions: EligibilityDivision[] = [
  {
    kicker: "DIVISION A",
    title: "Junior",
    grades: "6–8",
    color: "#B9F5D0",
    line: "rgba(185,245,208,0.16)",
    glow: "rgba(0,169,154,0.3)",
    shadow: "rgba(0,169,154,0.5)",
    background: "linear-gradient(160deg,#0B2C22,#030F0B 70%)",
    chipBackground: "rgba(185,245,208,0.05)",
    chipLine: "rgba(185,245,208,0.2)",
    gradeClass: "bg-[linear-gradient(180deg,#F2F7F4,#B9F5D0)]",
    challenge:
      "Create a game or application that makes learning fun or solves a daily problem.",
    platforms: ["Scratch", "MIT App Inventor"],
  },
  {
    kicker: "DIVISION B",
    title: "Senior",
    grades: "9–13",
    color: "#52FF3D",
    line: "rgba(82,255,61,0.2)",
    glow: "rgba(82,255,61,0.22)",
    shadow: "rgba(82,255,61,0.45)",
    background: "linear-gradient(160deg,#07200F,#020807 70%)",
    chipBackground: "rgba(82,255,61,0.05)",
    chipLine: "rgba(82,255,61,0.25)",
    gradeClass: "bg-[linear-gradient(180deg,#F2F7F4,#52FF3D)]",
    challenge:
      "Innovate for the Sustainable Development Goals with real-world technology.",
    platforms: ["Web", "Mobile", "Python", "AI", "IoT", "Robotics", "Desktop"],
  },
];

export const eligibilitySpecs: EligibilitySpec[] = [
  {
    value: "3–5",
    kicker: "TEAM SIZE",
    description: "Students per team, registered through their school.",
    color: "#00A99A",
  },
  {
    value: "12",
    kicker: "WEEKS",
    description: "Three phases and two hackathons.",
    color: "#B7F000",
  },
  {
    value: "01",
    kicker: "GRAND FINAL",
    description: "The Innovation Expo in week 12.",
    color: "#F0D875",
  },
];

export const gains: Gain[] = [
  {
    id: "technical-skills",
    n: "01",
    title: "Technical skills",
    description:
      "Hands-on experience building real software and hardware projects.",
    color: "#00A99A",
    tint: "rgba(0,169,154,0.10)",
    line: "rgba(0,169,154,0.4)",
    shadow: "rgba(0,169,154,0.45)",
    strokeClass: "[-webkit-text-stroke:1px_rgba(0,169,154,0.14)]",
    hoverBorder: "hover:border-[rgba(0,169,154,0.4)]",
    hoverShadow:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_60px_-36px_rgba(0,169,154,0.45)]",
  },
  {
    id: "design-thinking",
    n: "02",
    title: "Design thinking",
    description: "Identify problems and design solutions around people.",
    color: "#52FF3D",
    tint: "rgba(82,255,61,0.10)",
    line: "rgba(82,255,61,0.4)",
    shadow: "rgba(82,255,61,0.45)",
    strokeClass: "[-webkit-text-stroke:1px_rgba(82,255,61,0.14)]",
    hoverBorder: "hover:border-[rgba(82,255,61,0.4)]",
    hoverShadow:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_60px_-36px_rgba(82,255,61,0.45)]",
  },
  {
    id: "mentorship",
    n: "03",
    title: "Mentorship",
    description: "Feedback from experienced mentors at every phase.",
    color: "#B7F000",
    tint: "rgba(183,240,0,0.10)",
    line: "rgba(183,240,0,0.4)",
    shadow: "rgba(183,240,0,0.45)",
    strokeClass: "[-webkit-text-stroke:1px_rgba(183,240,0,0.14)]",
    hoverBorder: "hover:border-[rgba(183,240,0,0.4)]",
    hoverShadow:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_60px_-36px_rgba(183,240,0,0.45)]",
  },
  {
    id: "presentation",
    n: "04",
    title: "Presentation",
    description: "Pitch, demo and defend ideas in front of judges.",
    color: "#B9F5D0",
    tint: "rgba(185,245,208,0.10)",
    line: "rgba(185,245,208,0.4)",
    shadow: "rgba(185,245,208,0.45)",
    strokeClass: "[-webkit-text-stroke:1px_rgba(185,245,208,0.14)]",
    hoverBorder: "hover:border-[rgba(185,245,208,0.4)]",
    hoverShadow:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_60px_-36px_rgba(185,245,208,0.45)]",
  },
  {
    id: "entrepreneurship",
    n: "05",
    title: "Entrepreneurship",
    description: "Understand impact and how ideas become ventures.",
    color: "#00A99A",
    tint: "rgba(0,169,154,0.10)",
    line: "rgba(0,169,154,0.4)",
    shadow: "rgba(0,169,154,0.45)",
    strokeClass: "[-webkit-text-stroke:1px_rgba(0,169,154,0.14)]",
    hoverBorder: "hover:border-[rgba(0,169,154,0.4)]",
    hoverShadow:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_60px_-36px_rgba(0,169,154,0.45)]",
  },
  {
    id: "recognition",
    n: "06",
    title: "Recognition",
    description: "Awards and a showcase at the Innovation Expo.",
    color: "#F0D875",
    tint: "rgba(212,175,55,0.10)",
    line: "rgba(212,175,55,0.4)",
    shadow: "rgba(212,175,55,0.45)",
    strokeClass: "[-webkit-text-stroke:1px_rgba(212,175,55,0.14)]",
    hoverBorder: "hover:border-[rgba(212,175,55,0.4)]",
    hoverShadow:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_60px_-36px_rgba(212,175,55,0.45)]",
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
