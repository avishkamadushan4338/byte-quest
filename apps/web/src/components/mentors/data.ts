export type Expertise =
  | "ALL"
  | "TECHNOLOGY"
  | "DESIGN"
  | "AI"
  | "ENTREPRENEURSHIP"
  | "INNOVATION"
  | "SDGs";

export interface MentorContribution {
  n: string;
  title: string;
  description: string;
}

export const pending = "To be announced";

export const mentorPlaceholderName = "Mentor name";

export const expertiseFilters: Expertise[] = [
  "ALL",
  "TECHNOLOGY",
  "DESIGN",
  "AI",
  "ENTREPRENEURSHIP",
  "INNOVATION",
  "SDGs",
];

export const PLACEHOLDERS_PER_CATEGORY = 3;

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
