export interface NavLink {
  label: string;
  href: string;
}

export const primaryNavLinks: NavLink[] = [
  { label: "Programme", href: "/#programme" },
  { label: "Journey", href: "/#journey" },
  { label: "Projects", href: "/#projects" },
  { label: "Schools", href: "/#schools" },
  { label: "Awards", href: "/#awards" },
  { label: "Timeline", href: "/#timeline" },
  { label: "About", href: "/#about" },
];

export const menuLinks: NavLink[] = [
  { label: "Programme", href: "/#programme" },
  { label: "Journey", href: "/#journey" },
  { label: "Divisions", href: "/#divisions" },
  { label: "Projects", href: "/#projects" },
  { label: "Schools", href: "/#schools" },
  { label: "Awards", href: "/#awards" },
  { label: "Timeline", href: "/#timeline" },
  { label: "About", href: "/#about" },
  { label: "Register", href: "/auth/login" },
];

export const footerNavLinks: NavLink[] = [
  { label: "Programme", href: "/#programme" },
  { label: "Journey", href: "/#journey" },
  { label: "Projects", href: "/#projects" },
  { label: "Awards", href: "/#awards" },
  { label: "Timeline", href: "/#timeline" },
  { label: "Register", href: "/auth/login" },
];

export const footerGuidelineLinks: NavLink[] = [
  { label: "Privacy", href: "/#contact" },
  { label: "Terms", href: "/#contact" },
  { label: "Code of Conduct", href: "/#contact" },
  { label: "Submission Guidelines", href: "/#contact" },
];
