export type Division = "JUNIOR" | "SENIOR";

export type Category =
  | "Education"
  | "Health"
  | "Environment"
  | "Community"
  | "AI"
  | "IoT";

export interface Project {
  id: string;
  title: string;
  school: string;
  team: string;
  division: Division;
  category: Category;
  tech: string;
  summary: string;
  award?: string;
}

export interface DivisionMeta {
  label: string;
  chip: string;
  text: string;
  border: string;
  scope: string;
}

export const projectsHero = {
  breadcrumb: [{ label: "Home", to: "/" }, { label: "Projects" }],
  kicker: "INNOVATION EXHIBITION",
  title: "Student projects.",
  lead: "A gallery of the games, apps and SDG solutions built by BYTE QUEST teams. Approved projects are published after Hackathon 01.",
};

export const projectsClosing = {
  title: "Your project could be next.",
  actions: [
    { label: "Register your team", to: "/register", variant: "primary" },
    { label: "Read the programme", to: "/programme", variant: "outline" },
  ],
} as const;

export const divisionFilters = ["ALL", "JUNIOR", "SENIOR"] as const;

export const categoryFilters = [
  "All",
  "Education",
  "Health",
  "Environment",
  "Community",
  "AI",
  "IoT",
] as const;

export const divisionMeta: Record<Division, DivisionMeta> = {
  JUNIOR: {
    label: "JUNIOR",
    chip: "border-mint/40 text-mint",
    text: "text-mint",
    border: "border-mint/30",
    scope: "Junior · Grades 6–8",
  },
  SENIOR: {
    label: "SENIOR",
    chip: "border-volt/40 text-volt",
    text: "text-volt",
    border: "border-volt/30",
    scope: "Senior · Grades 9–13",
  },
};

export const categoryTints: Record<Category, string> = {
  Education: "rgba(185,245,208,.14)",
  Health: "rgba(0,169,154,.2)",
  Environment: "rgba(82,255,61,.14)",
  Community: "rgba(0,169,154,.16)",
  AI: "rgba(183,240,0,.14)",
  IoT: "rgba(212,175,55,.14)",
};

export const galleryNote = "SAMPLE LAYOUT · PROJECTS TBA";

export const galleryEmpty = {
  title: "No projects match these filters.",
  description:
    "Try a different division, category or search term — or clear every filter to see the full exhibition.",
  action: "Clear filters",
};

export const projects: Project[] = [
  {
    id: "eco-sense",
    title: "EcoSense",
    school: "St. Aloysius' College, Galle",
    team: "Circuit Busters",
    division: "JUNIOR",
    category: "Education",
    tech: "Scratch",
    summary:
      "A quiz-and-story game that turns coastal clean-up duty into a class-wide challenge, tracking collected waste for a school-wide leaderboard.",
  },
  {
    id: "pulse-point",
    title: "PulsePoint",
    school: "Royal College, Colombo",
    team: "MediMinds",
    division: "SENIOR",
    category: "Health",
    tech: "Mobile",
    summary:
      "A mobile triage companion that guides first-aiders through basic wound care and escalation steps, with offline checklists for rural clinics.",
  },
  {
    id: "river-guard",
    title: "RiverGuard",
    school: "Ananda College, Colombo",
    team: "AquaSentinels",
    division: "SENIOR",
    category: "Environment",
    tech: "IoT",
    summary:
      "Floating pH and turbidity sensors that post live water-quality readings to a public map so communities know when the river is safe to use.",
    award: "Best SDG Impact",
  },
  {
    id: "kindred",
    title: "Kindred",
    school: "St. Thomas' College, Matara",
    team: "Neighbourhood Ninjas",
    division: "JUNIOR",
    category: "Community",
    tech: "MIT App Inventor",
    summary:
      "A neighbourhood help board where neighbours can offer and request errands, hand-me-downs and study support within a verified radius.",
  },
  {
    id: "mind-bridge",
    title: "MindBridge",
    school: "Trinity College, Kandy",
    team: "Silicon Scholars",
    division: "SENIOR",
    category: "AI",
    tech: "Python · AI",
    summary:
      "A revision assistant that turns a student's own past-paper answers into spaced-repetition quizzes and flags the topics they keep missing.",
  },
  {
    id: "agri-pulse",
    title: "AgriPulse",
    school: "D.S. Senanayake College, Kandy",
    team: "Harvest Bots",
    division: "SENIOR",
    category: "IoT",
    tech: "IoT · Robotics",
    summary:
      "Soil-moisture nodes wired to a small rover that only waters each crop row when its own sensors say it is dry, cutting wasted water use.",
  },
  {
    id: "word-wander",
    title: "WordWander",
    school: "Girls' College, Galle",
    team: "Story Sprouts",
    division: "JUNIOR",
    category: "Education",
    tech: "Scratch",
    summary:
      "A story-building game where students assemble vocabulary banks into playable adventures, building spelling confidence without pressure.",
  },
  {
    id: "zero-waste-route",
    title: "ZeroWaste Route",
    school: "Nalanda College, Colombo",
    team: "Green Circuit",
    division: "SENIOR",
    category: "Environment",
    tech: "IoT",
    summary:
      "Smart collection bins that weigh what is thrown in, then suggest pickup schedules to municipal drivers so routes stop overflowing.",
  },
  {
    id: "sahana",
    title: "Sahana",
    school: "Richmond College, Galle",
    team: "Unity Labs",
    division: "SENIOR",
    category: "Community",
    tech: "Web",
    summary:
      "A volunteer coordination platform that matches disaster-response skills with local needs, from shelter shifts to blood donation drives.",
  },
];
