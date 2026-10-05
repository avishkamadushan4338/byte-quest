export type Division = "JUNIOR" | "SENIOR";

export type Category =
  | "Education"
  | "Health"
  | "Environment"
  | "Community"
  | "AI"
  | "IoT";

export interface Project {
  id: number;
  division: Division;
  category: Category;
  tech: string;
  award?: string;
}

export interface DivisionMeta {
  color: string;
  line: string;
  scope: string;
}

export const projectsHero = {
  kicker: "INNOVATION EXHIBITION",
  title: "Student projects.",
  lead: "A gallery of the games, apps and SDG solutions built by BYTE QUEST teams. Approved projects are published after Hackathon 01.",
};

export const projectsClosing = {
  title: "Your project could be here.",
  actions: [{ label: "Register your team →", to: "/register" }],
};

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
    color: "#B9F5D0",
    line: "rgba(185,245,208,0.3)",
    scope: "Junior · Grades 6–8",
  },
  SENIOR: {
    color: "#52FF3D",
    line: "rgba(82,255,61,0.3)",
    scope: "Senior · Grades 9–13",
  },
};

export const categoryTints: Record<Category, string> = {
  Education: "rgba(185,245,208,0.14)",
  Health: "rgba(0,169,154,0.2)",
  Environment: "rgba(82,255,61,0.14)",
  Community: "rgba(0,169,154,0.16)",
  AI: "rgba(183,240,0,0.14)",
  IoT: "rgba(212,175,55,0.14)",
};

const seniorTech: Record<Category, string> = {
  Education: "Scratch",
  Health: "Mobile",
  Environment: "IoT",
  Community: "Web",
  AI: "Python · AI",
  IoT: "IoT · Robotics",
};

const seed: [Division, Category][] = [
  ["JUNIOR", "Education"],
  ["SENIOR", "Health"],
  ["SENIOR", "Environment"],
  ["JUNIOR", "Community"],
  ["SENIOR", "AI"],
  ["SENIOR", "IoT"],
  ["JUNIOR", "Education"],
  ["SENIOR", "Environment"],
  ["SENIOR", "Community"],
];

const juniorTech = (index: number) =>
  index % 2 === 1 ? "MIT App Inventor" : "Scratch";

export const projects: Project[] = seed.map(([division, category], id) => ({
  id,
  division,
  category,
  tech: division === "JUNIOR" ? juniorTech(id) : seniorTech[category],
}));

export const placeholderTitle = "Project title";
export const placeholderByline = "School · Team name";
export const pending = "To be announced";
export const projectYear = "2026";
export const projectSummary =
  "The project summary, the problem it addresses and how it works will appear here once published.";

export const galleryNote = "SAMPLE LAYOUT · PROJECTS TBA";

export const galleryEmpty = {
  title: "No projects match these filters.",
  action: "Clear filters",
};
