export const heroStrip = [
  { key: "HACKATHON 01", title: "Innovation Challenge", accent: "#00A99A" },
  { key: "HACKATHON 02", title: "Prototype Challenge", accent: "#52FF3D" },
  { key: "GRAND FINAL", title: "Innovation Expo", accent: "#F0D875" },
];

export const pillars = [
  {
    n: "01",
    title: "Learn",
    color: "#00A99A",
    line: "rgba(0,169,154,0.35)",
    description: "Workshops in design thinking, UI/UX, coding and pitching.",
  },
  {
    n: "02",
    title: "Build",
    color: "#52FF3D",
    line: "rgba(82,255,61,0.35)",
    description: "Teams turn real problems into working prototypes.",
  },
  {
    n: "03",
    title: "Innovate",
    color: "#B7F000",
    line: "rgba(183,240,0,0.35)",
    description: "Mentorship sharpens ideas into meaningful solutions.",
  },
  {
    n: "04",
    title: "Inspire",
    color: "#F0D875",
    line: "rgba(240,216,117,0.35)",
    description: "Finalists showcase their work at the Innovation Expo.",
  },
];

export const phases = [
  {
    n: "01",
    weeks: "WEEKS 1–4",
    title: "Innovation Foundation",
    color: "#00A99A",
    line: "rgba(0,169,154,0.4)",
    glow: "rgba(0,169,154,0.25)",
    fill: "33%",
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
    n: "02",
    weeks: "WEEKS 5–8",
    title: "Development",
    color: "#52FF3D",
    line: "rgba(82,255,61,0.4)",
    glow: "rgba(82,255,61,0.2)",
    fill: "66%",
    items: ["UI/UX", "Coding", "Mentoring", "Prototype Development"],
  },
  {
    n: "03",
    weeks: "WEEKS 9–12",
    title: "Refinement",
    color: "#D4AF37",
    line: "rgba(212,175,55,0.45)",
    glow: "rgba(212,175,55,0.2)",
    fill: "100%",
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

export const moments = [
  {
    n: "01",
    kicker: "HACKATHON 01",
    title: "Innovation Challenge",
    flow: ["Idea", "Problem", "Concept", "Prototype"],
    accent: "#00A99A",
    glow: "rgba(0,169,154,0.5)",
    glowSoft: "rgba(0,169,154,0.22)",
  },
  {
    n: "02",
    kicker: "HACKATHON 02",
    title: "Prototype Challenge",
    flow: ["Build", "Test", "Present", "Improve"],
    accent: "#52FF3D",
    glow: "rgba(82,255,61,0.45)",
    glowSoft: "rgba(82,255,61,0.16)",
  },
  {
    n: "03",
    kicker: "GRAND FINAL",
    title: "Innovation Expo",
    flow: ["Showcase", "Judge", "Celebrate", "Inspire"],
    accent: "#D4AF37",
    glow: "rgba(212,175,55,0.5)",
    glowSoft: "rgba(212,175,55,0.18)",
  },
];

export const divisions = [
  {
    label: "DIVISION A",
    name: "Junior",
    grades: "6–8",
    bg: "linear-gradient(160deg,#0A2A20,#030F0B)",
    border: "rgba(185,245,208,0.14)",
    glow: "rgba(0,169,154,0.3)",
    accent: "#B9F5D0",
    accentLine: "rgba(185,245,208,0.28)",
    challenge:
      "Create a game or application that makes learning fun or solves a daily problem.",
    focus: ["Creativity", "Problem Solving", "Learning", "Experimentation"],
    platforms: ["Scratch", "MIT App Inventor"],
  },
  {
    label: "DIVISION B",
    name: "Senior",
    grades: "9–13",
    bg: "linear-gradient(160deg,#06170F,#020807)",
    border: "rgba(82,255,61,0.18)",
    glow: "rgba(82,255,61,0.22)",
    accent: "#52FF3D",
    accentLine: "rgba(82,255,61,0.32)",
    challenge: "Innovate for the Sustainable Development Goals.",
    focus: [
      "Technology",
      "Innovation",
      "Sustainability",
      "Real-world problem solving",
    ],
    platforms: ["Web", "Mobile", "Python", "AI", "IoT", "Robotics", "Desktop"],
  },
];

export const impactSteps = [
  {
    n: "01",
    title: "Identify",
    description: "Find a real problem in your community.",
  },
  {
    n: "02",
    title: "Map",
    description: "Connect it to a Sustainable Development Goal.",
  },
  { n: "03", title: "Build", description: "Prototype a technology solution." },
  {
    n: "04",
    title: "Impact",
    description: "Present how it creates meaningful change.",
  },
];

export const projectFilters = ["All", "Junior", "Senior", "SDG", "AI", "IoT"];

export const projectSlots = [
  { division: "JUNIOR", color: "#B9F5D0", line: "rgba(185,245,208,0.3)" },
  { division: "SENIOR", color: "#52FF3D", line: "rgba(82,255,61,0.3)" },
  { division: "SENIOR", color: "#52FF3D", line: "rgba(82,255,61,0.3)" },
];

export const podium = [
  {
    rank: "2",
    title: "1st Runner-Up",
    medal: "46px",
    height: "96px",
    glow: "0.25",
  },
  {
    rank: "1",
    title: "Champion",
    medal: "62px",
    height: "136px",
    glow: "0.55",
  },
  {
    rank: "3",
    title: "2nd Runner-Up",
    medal: "40px",
    height: "72px",
    glow: "0.2",
  },
];

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

export const weeks = [
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

export const milestoneWeeks = [6, 11, 12];

export const weekTags: Record<number, string> = {
  6: "HACK 01",
  11: "HACK 02",
  12: "FINAL",
};

export const phaseOf = (week: number) => {
  if (week <= 4) {
    return "PHASE 01 · FOUNDATION";
  }
  if (week <= 8) {
    return "PHASE 02 · DEVELOPMENT";
  }
  return "PHASE 03 · REFINEMENT";
};
