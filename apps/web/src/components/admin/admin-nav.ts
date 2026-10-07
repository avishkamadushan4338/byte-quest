export interface AdminNavLink {
  label: string;
  href: string;
}

export const adminNavLinks: AdminNavLink[] = [
  { label: "Applications", href: "/admin/applications" },
  { label: "Users", href: "/admin/users" },
  { label: "Schools", href: "/admin/schools" },
  { label: "Teams", href: "/admin/teams" },
  { label: "Submissions", href: "/admin/submissions" },
  { label: "Volunteers", href: "/admin/volunteers" },
  { label: "Media", href: "/admin/media" },
];
