export type VolunteerApplicationStatus = "pending" | "approved" | "rejected";

export type VolunteerApplicationStatusFilter =
  | VolunteerApplicationStatus
  | "all";

export interface VolunteerApplicationRow {
  id: string;
  reference: string;
  teams: string[];
  fullName: string;
  school: string;
  admissionNumber: string | null;
  grade: string;
  className: string;
  contactNumber: string;
  email: string | null;
  guardianName: string;
  guardianRelationship: string | null;
  guardianContactNumber: string;
  guardianAlternateContactNumber: string | null;
  status: VolunteerApplicationStatus;
  reviewNote: string | null;
  reviewedAt: string | null;
  accountIssued: boolean;
  userId: string | null;
  username: string | null;
  accountEmail: string | null;
}

export const volunteerApplicationCopy = {
  approve: "Approve",
  reject: "Reject",
  approved: "Application approved",
  rejected: "Application rejected",
  failed: "We could not complete that decision",
  empty: "No volunteer applications match this status.",
  statusLabels: {
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
  } satisfies Record<VolunteerApplicationStatus, string>,
};
