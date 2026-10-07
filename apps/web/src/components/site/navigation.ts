export interface NavLink {
  label: string;
  href: string;
}

export const primaryNavLinks: NavLink[] = [
  { label: "Journey", href: "/journey" },
  { label: "Mentors", href: "/mentors" },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
];

export const menuLinks: NavLink[] = [
  { label: "Journey", href: "/journey" },
  { label: "Divisions", href: "/#divisions" },
  { label: "Mentors", href: "/mentors" },
  { label: "Awards", href: "/#awards" },
  { label: "Timeline", href: "/#timeline" },
  { label: "Partners", href: "/partners" },
  { label: "Volunteer", href: "/volunteers" },
  { label: "Register", href: "/register" },
];

export const footerNavLinks: NavLink[] = [
  { label: "Mentors", href: "/mentors" },
  { label: "Partners", href: "/partners" },
  { label: "Volunteer", href: "/volunteers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "#contact" },
];

export const footerGuidelineLinks: NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Code of Conduct", href: "/code-of-conduct" },
  { label: "Submission Guidelines", href: "/submission-guidelines" },
];

export const isInternalHref = (href: string) =>
  href.startsWith("/") && !href.startsWith("/#");
