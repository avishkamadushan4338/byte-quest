export interface NavLink {
  label: string;
  href: string;
}

export const primaryNavLinks: NavLink[] = [
  { label: "Programme", href: "/programme" },
  { label: "Journey", href: "/journey" },
  { label: "Mentors", href: "/mentors" },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
];

/** Mobile menu mirrors the desktop bar; the Volunteer CTA is a button in the menu footer. */
export const menuLinks: NavLink[] = [...primaryNavLinks];

export const footerProgrammeLinks: NavLink[] = [
  { label: "Programme", href: "/programme" },
  { label: "Journey", href: "/journey" },
  { label: "Projects", href: "/projects" },
  { label: "Register", href: "/register" },
];

export const footerNavLinks: NavLink[] = [
  { label: "Volunteer", href: "/volunteers" },
  { label: "Mentors", href: "/mentors" },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
];

export const footerGuidelineLinks: NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export const isInternalHref = (href: string) =>
  href.startsWith("/") && !href.startsWith("/#");
