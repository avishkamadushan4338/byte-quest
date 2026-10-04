import type { BadgeTone } from "@byte-quest/ui/components/badge";

export type AdminTab = "users" | "schools" | "teams" | "submissions";

export type UserRole = "admin" | "student";

export type Division = "primary" | "secondary";

export type SubmissionStatus = "draft" | "submitted" | "approved" | "rejected";

export type StatusFilter = SubmissionStatus | "all";

export interface AdminSchool {
  city: string;
  id: string;
  name: string;
}

export interface AdminSubmission {
  description: string;
  id: string;
  title: string;
}

export interface SchoolDialogState {
  city: string;
  id: string | null;
  name: string;
  open: boolean;
}

export interface SchoolFormErrors {
  city?: string;
  name?: string;
}

export const adminHero = {
  kicker: "CONTROL ROOM",
  lead: "Oversee registrations, schools, teams and submissions across the programme.",
  title: "Admin console.",
};

export const adminCopy = {
  tabsLabel: "Admin sections",
};

export const adminTabs: { label: string; value: AdminTab }[] = [
  { label: "Users", value: "users" },
  { label: "Schools", value: "schools" },
  { label: "Teams", value: "teams" },
  { label: "Submissions", value: "submissions" },
];

export const roleBadgeTones: Record<UserRole, BadgeTone> = {
  admin: "volt",
  student: "neutral",
};

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  student: "Student",
};

export const usersCopy = {
  failureMessage: "We could not update that role",
  makeAdmin: "Make admin",
  makeStudent: "Make student",
  ownRowHint: "You cannot change your own role",
  roleUpdatedMessage: "Role updated",
  youBadge: "You",
};

export const usersEmpty = {
  description:
    "Registered participants appear here once they complete onboarding.",
  title: "No users yet",
};

export const schoolsCopy = {
  addLabel: "Add school",
  cancelLabel: "Cancel",
  createdMessage: "School registered",
  createTitle: "Add school",
  editLabel: "Edit",
  editTitle: "Edit school",
  failureMessage: "We could not save that school",
  formDescription:
    "Schools anchor every team, so the name and city must match the registration records.",
  saveLabel: "Save school",
  updatedMessage: "School updated",
};

export const schoolsEmpty = {
  description:
    "Register the schools taking part so teams can be attached to them.",
  title: "No schools yet",
};

export const schoolsEmptyFields: SchoolDialogState = {
  city: "",
  id: null,
  name: "",
  open: false,
};

export const schoolValidation = {
  required: "Required",
};

export const teamsCopy = {
  membersHeader: "Members",
  rangeHeader: "Target",
};

export const teamsEmpty = {
  description: "Teams appear here once students create or join one.",
  title: "No teams yet",
};

export const divisionBadgeTones: Record<Division, BadgeTone> = {
  primary: "teal",
  secondary: "volt",
};

export const divisionLabels: Record<Division, string> = {
  primary: "Primary",
  secondary: "Secondary",
};

export const submissionsCopy = {
  filtersLabel: "Filter by status",
  noDate: "—",
  reviewLabel: "Review",
};

export const submissionsEmpty = {
  description:
    "Submissions appear here once a team forwards its project for review.",
  title: "No submissions",
};

export const statusBadgeOverrides: Partial<Record<SubmissionStatus, string>> = {
  rejected: "border-destructive/40 text-destructive",
};

export const statusBadgeTones: Record<SubmissionStatus, BadgeTone> = {
  approved: "volt",
  draft: "neutral",
  rejected: "gold",
  submitted: "teal",
};

export const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Submitted", value: "submitted" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export const statusLabels: Record<SubmissionStatus, string> = {
  approved: "Approved",
  draft: "Draft",
  rejected: "Rejected",
  submitted: "Submitted",
};

export const reviewCopy = {
  approveLabel: "Approve",
  cancelLabel: "Cancel",
  description:
    "Approving moves the submission to the approved queue. Rejecting returns it to the team with your note.",
  failureMessage: "We could not record that review",
  noteLabel: "Review note",
  notePlaceholder: "Optional — shared with the team",
  proposalLabel: "Proposal",
  rejectLabel: "Reject",
  rejectClassName:
    "border-destructive/50 text-destructive hover:border-destructive hover:text-destructive",
  successMessage: "Review recorded",
  title: "Review submission",
};
