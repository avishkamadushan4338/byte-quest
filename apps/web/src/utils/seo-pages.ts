/**
 * Route SEO registry. Every public, user-facing route must appear here; paths
 * that are not listed are treated as private/unknown and rendered `noindex`.
 *
 * Copy may only state facts that are already published on the page itself.
 * Do not add dates, venues, prizes or partner names here until the organisers
 * confirm them.
 */
export interface SeoPage {
  /** Path whose canonical differs from itself (duplicate-content variants). */
  canonicalPath?: string;
  description: string;
  indexable: boolean;
  path: string;
  title: string;
  /** Use `title` verbatim instead of appending the site name. */
  absoluteTitle?: boolean;
}

const PLACEHOLDER_NOTE =
  "This page is a placeholder until the organisers publish its content.";

export const seoPages: SeoPage[] = [
  {
    path: "/",
    indexable: true,
    absoluteTitle: true,
    title: "BYTE QUEST | Inter-School Innovation & Coding Programme",
    description:
      "BYTE QUEST is a three-month inter-school innovation and coding programme for Sri Lankan students in Grades 6–13, organised by the Old Boys' Association of St. Aloysius' College, Galle.",
  },
  {
    path: "/about",
    indexable: true,
    title: "About & Organisers",
    description:
      "Learn about BYTE QUEST, presented by the Old Boys' Association of St. Aloysius' College Galle (SACOBA) to cultivate digital innovators across Sri Lanka.",
  },
  {
    path: "/programme",
    indexable: true,
    title: "Programme: Divisions, Phases & Hackathons",
    description:
      "How BYTE QUEST works: a three-month programme for Junior and Senior Division teams of 3–5 students, with mentor-guided phases, two hackathons and a Grand Final.",
  },
  {
    path: "/journey",
    indexable: true,
    title: "Journey & Milestones",
    description:
      "The step-by-step roadmap of BYTE QUEST from school registrations and bootcamps to the national finals.",
  },
  {
    path: "/partners",
    indexable: true,
    title: "Partners & Sponsors",
    description:
      "Partner with BYTE QUEST to sponsor prizes, technology access, and career opportunities for young Sri Lankan developers.",
  },
  {
    path: "/volunteers",
    indexable: true,
    title: "Student Volunteers",
    description:
      "Join the crew behind BYTE QUEST. Apply as a student volunteer to create, present, design and run Sri Lanka's premier school tech quest.",
  },
  {
    path: "/register/team",
    indexable: true,
    title: "Register your school team",
    description:
      "Register a school team for BYTE QUEST: choose the Junior or Senior Division, add your team, students and teacher in charge, then review before submitting.",
  },
  {
    path: "/privacy",
    indexable: true,
    title: "Privacy Policy",
    description:
      "What BYTE QUEST collects, why we collect it, and what we never do with it.",
  },
  {
    path: "/terms",
    indexable: true,
    title: "Terms of Participation",
    description: "The ground rules every BYTE QUEST participant agrees to.",
  },
  {
    path: "/code-of-conduct",
    indexable: true,
    title: "Code of Conduct",
    description:
      "How BYTE QUEST participants, mentors and organisers work together for the length of the programme.",
  },
  {
    path: "/submission-guidelines",
    indexable: true,
    title: "Submission Guidelines",
    description: "What to submit, when, and how it is judged.",
  },
  // Duplicate of /volunteers (same content with a back link): canonicalised.
  {
    path: "/register/volunteer",
    canonicalPath: "/volunteers",
    indexable: true,
    title: "Student Volunteers",
    description:
      "Join the crew behind BYTE QUEST. Apply as a student volunteer to create, present, design and run Sri Lanka's premier school tech quest.",
  },
  // Placeholder pages: no real content yet, so kept out of the index and sitemap.
  {
    path: "/mentors",
    indexable: false,
    title: "Mentors",
    description: `The BYTE QUEST mentor line-up has not been announced yet. ${PLACEHOLDER_NOTE}`,
  },
  {
    path: "/projects",
    indexable: false,
    title: "Projects",
    description: `Student projects will be featured here once teams publish them. ${PLACEHOLDER_NOTE}`,
  },
  {
    path: "/coming-soon",
    indexable: false,
    title: "Coming soon",
    description: PLACEHOLDER_NOTE,
  },
];

/** Authenticated, transactional or redirect-only routes. Always `noindex`. */
export const privatePathPrefixes = [
  "/admin",
  "/apply-admin",
  "/auth",
  "/dashboard",
  "/onboarding",
  "/volunteer-portal",
  "/register",
] as const;

export const normalizePath = (raw: string): string => {
  const [withoutQuery = ""] = raw.split(/[?#]/u);
  const prefixed = withoutQuery.startsWith("/")
    ? withoutQuery
    : `/${withoutQuery}`;
  return prefixed.length > 1 ? prefixed.replace(/\/+$/u, "") || "/" : prefixed;
};

export const findPage = (path: string): SeoPage | undefined =>
  seoPages.find((page) => page.path === path);

/** True for routes that exist but are private (as opposed to a 404). */
export const isKnownPath = (path: string): boolean =>
  privatePathPrefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
