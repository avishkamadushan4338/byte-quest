export type Expertise =
  | "ALL"
  | "TECHNOLOGY"
  | "DESIGN"
  | "AI"
  | "ENTREPRENEURSHIP"
  | "INNOVATION"
  | "SDGs";

export interface Mentor {
  id: string;
  name: string;
  role: string;
  organisation: string;
  category: Expertise;
  categories: Expertise[];
}

export interface MentorContribution {
  n: string;
  title: string;
  description: string;
}

export const pending = "To be announced";

export const expertiseFilters: Expertise[] = [
  "ALL",
  "TECHNOLOGY",
  "DESIGN",
  "AI",
  "ENTREPRENEURSHIP",
  "INNOVATION",
  "SDGs",
];

export const mentors: Mentor[] = [
  {
    id: "nimal-perera",
    name: "Dr. Nimal Perera",
    role: "Software Engineer",
    organisation: "Virtusa",
    category: "TECHNOLOGY",
    categories: ["TECHNOLOGY"],
  },
  {
    id: "amaya-rajapaksa",
    name: "Dr. Amaya Rajapaksa",
    role: "Senior Lecturer, Computer Science",
    organisation: "University of Colombo",
    category: "AI",
    categories: ["AI", "TECHNOLOGY"],
  },
  {
    id: "chamara-silva",
    name: "Chamara Silva",
    role: "Product Designer",
    organisation: "Wipro Digital",
    category: "DESIGN",
    categories: ["DESIGN"],
  },
  {
    id: "nadeesha-wickramasinghe",
    name: "Nadeesha Wickramasinghe",
    role: "Founder & CEO",
    organisation: "Loopworks",
    category: "ENTREPRENEURSHIP",
    categories: ["ENTREPRENEURSHIP", "INNOVATION"],
  },
  {
    id: "ruwan-bandara",
    name: "Dr. Ruwan Bandara",
    role: "Research Scientist",
    organisation: "IBM Research",
    category: "INNOVATION",
    categories: ["INNOVATION", "AI"],
  },
  {
    id: "ishara-gunathilake",
    name: "Ishara Gunathilake",
    role: "Sustainability Programme Lead",
    organisation: "",
    category: "SDGs",
    categories: ["SDGs", "INNOVATION"],
  },
];

export const directoryNote =
  "Mentor profiles will be published once confirmed.";

export const mentorshipMailto =
  "mailto:?subject=BYTE%20QUEST%20Mentorship%20Enquiry";

export const becomeMentor = {
  kicker: "BECOME A MENTOR",
  title: "Share what you know. Shape what comes next.",
  body: "We welcome professionals and academics in technology, design, AI, entrepreneurship, innovation and the SDGs.",
  action: "Express interest →",
};

export const contributions: MentorContribution[] = [
  {
    n: "01",
    title: "Workshops",
    description: "Lead sessions on design thinking, coding, UI/UX or pitching.",
  },
  {
    n: "02",
    title: "Team guidance",
    description: "Support teams during development and refinement.",
  },
  {
    n: "03",
    title: "Reviews",
    description: "Give feedback at mentor and prototype reviews.",
  },
  {
    n: "04",
    title: "Expo",
    description: "Engage with finalists at the Innovation Expo.",
  },
];
