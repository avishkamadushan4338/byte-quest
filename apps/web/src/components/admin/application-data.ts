export type ApplicationStatus = "pending" | "approved" | "rejected";

export type ApplicationStatusFilter = ApplicationStatus | "all";

export interface ApplicationRow {
  id: string;
  fullName: string;
  email: string;
  username: string;
  organization: string;
  role: string;
  experience: string;
  status: ApplicationStatus;
  reviewNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export const applicationCopy = {
  approve: "Approve",
  reject: "Reject",
  approved: "Application approved",
  rejected: "Application rejected",
  failed: "We could not complete that decision",
  empty: "No applications match this status.",
  selectedOne: "1 selected",
  selectedMany: "{count} selected",
  approveSelected: "Approve selected",
  rejectSelected: "Reject selected",
  clearSelection: "Clear",
  bulkApproved: "Approved {count}",
  bulkRejected: "Rejected {count}",
  bulkSkipped: "{count} skipped: {reason}",
  credentialsTitle: "Credentials issued ({count})",
  credentialsNote:
    "Share these one-time login details. They are shown only once and nobody is signed in automatically.",
  statusLabels: {
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
  } satisfies Record<ApplicationStatus, string>,
};

export const adminTabLabels = {
  applications: "Applications",
  schools: "Schools",
  submissions: "Submissions",
  teams: "Teams",
  users: "Users",
};
