import type { BadgeTone } from "@byte-quest/ui/components/badge";
import type { SelectOption } from "@byte-quest/ui/components/fields";

export type Division = "primary" | "secondary";
export type Specialty = "ui" | "architecture" | "business";
export type TeamRole = "leader" | "developer";
export type JoinRequestStatus = "pending" | "approved" | "rejected";
export type SubmissionStatus = "draft" | "submitted" | "approved" | "rejected";
export type NoTeamView = "choose" | "join";

export interface DashboardMe {
  userId: string;
  username: string | null;
  role: "admin" | "mic" | "leader" | "student";
  fullName: string;
  nationalId: string;
  birthday: string;
  grade: string;
}

export interface DashboardTeam {
  id: string;
  name: string;
  division: Division;
  schoolId: string;
  memberCount: number;
}

export interface DashboardSubmission {
  id: string;
  teamId: string;
  title: string;
  description: string;
  repoUrl: string | null;
  status: SubmissionStatus;
  schoolId: string | null;
  forwardedAt: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
}

export interface TeamMember {
  userId: string;
  fullName: string;
  grade: string;
  teamRole: TeamRole;
  specialty: Specialty | null;
}

export interface JoinRequest {
  id: string;
  teamId: string;
  userId: string;
  status: JoinRequestStatus;
  grade: string;
  specialty: Specialty | null;
}

export interface School {
  id: string;
  name: string;
  city: string;
}

export interface SchoolSlots extends School {
  primarySlotsUsed: number;
  secondarySlotsUsed: number;
}

export interface CreateTeamForm {
  name: string;
  schoolId: string | null;
}

export interface CreateTeamErrors {
  name?: string;
  schoolId?: string;
}

export interface SubmissionForm {
  title: string;
  description: string;
  repoUrl: string;
}

export interface SubmissionErrors {
  title?: string;
  description?: string;
  repoUrl?: string;
}

export const TEAM_MIN_MEMBERS = 3;
export const TEAM_MAX_MEMBERS = 5;

export const SPECIALTIES: Specialty[] = ["ui", "architecture", "business"];

export const inferDivision = (grade: string): Division =>
  Number(grade) <= 9 ? "primary" : "secondary";

export const divisionLabels: Record<Division, string> = {
  primary: "Junior",
  secondary: "Senior",
};

export const divisionRanges: Record<Division, string> = {
  primary: "Grades 6-9",
  secondary: "Grades 10-13",
};

export const divisionPlatforms: Record<Division, string[]> = {
  primary: ["Scratch", "MIT App Inventor"],
  secondary: ["Web", "Mobile", "Python", "AI", "IoT", "Robotics", "Desktop"],
};

export const divisionBadgeTones: Record<Division, BadgeTone> = {
  primary: "teal",
  secondary: "volt",
};

export const specialtyLabels: Record<Specialty, string> = {
  ui: "UI",
  architecture: "Architecture",
  business: "Business",
};

export const specialtyBadgeTones: Record<Specialty, BadgeTone> = {
  ui: "teal",
  architecture: "mint",
  business: "gold",
};

export const specialtyOptions: SelectOption[] = SPECIALTIES.map(
  (specialty) => ({
    value: specialty,
    label: specialtyLabels[specialty],
  })
);

export const teamRoleLabels: Record<TeamRole, string> = {
  leader: "Leader",
  developer: "Developer",
};

export const teamRoleBadgeTones: Record<TeamRole, BadgeTone> = {
  leader: "volt",
  developer: "neutral",
};

export const submissionStatusLabels: Record<SubmissionStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
};

export const submissionStatusBadgeTones: Record<SubmissionStatus, BadgeTone> = {
  draft: "neutral",
  submitted: "teal",
  approved: "volt",
  rejected: "neutral",
};

export const joinRequestStatusLabels: Record<JoinRequestStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export const joinRequestStatusBadgeTones: Record<JoinRequestStatus, BadgeTone> =
  {
    pending: "gold",
    approved: "volt",
    rejected: "neutral",
  };

export const dashboardHero = {
  kicker: "YOUR QUEST",
  title: "Team dashboard.",
  leadPrefix: "Signed in as",
  leadSuffix: "here is where your team stands today.",
};

export const dashboardStatCopy = {
  divisionLabel: "Division",
  gradeLabel: "Grade",
  teamSizeLabel: "Team size",
  teamSizeHint: `${TEAM_MIN_MEMBERS}-${TEAM_MAX_MEMBERS} members`,
  noTeam: "—",
  submissionLabel: "Submission",
  notStarted: "Not started",
};

export const noTeamCopy = {
  emptyTitle: "You are not on a team yet",
  emptyDescription:
    "Teams register through their school. A school fields one team per division, so join an existing team or create yours.",
  createLabel: "Create a team",
  findLabel: "Find a team",
};

export const createTeamCopy = {
  dialogTitle: "Create your team",
  dialogDescription:
    "Your grade fixes your division, and a school can only field one team per division. If your school already has one, ask its coordinator for the team ID instead.",
  schoolLabel: "School",
  schoolPlaceholder: "Search your school",
  schoolDescription:
    "A school fields one team per division, so check with your coordinator first.",
  nameLabel: "Team name",
  namePlaceholder: "e.g. Byte Busters",
  divisionLegend: "Division",
  divisionDescription: "Locked to your grade",
  submitLabel: "Create team",
  submittingLabel: "Creating…",
  cancelLabel: "Cancel",
  success: "Team created",
  failure: "We could not create your team",
};

export const joinPanelCopy = {
  title: "Find your school's team",
  description:
    "Pick your school to see whether it already fields a team in your division. BYTE QUEST keeps the team list private, so your school coordinator confirms membership.",
  rulesTitle: "How joining works",
  rulesBody: `A school fields exactly one team per division, a team holds ${TEAM_MIN_MEMBERS} to ${TEAM_MAX_MEMBERS} members, and UI, architecture and business must all be covered. Ask your school coordinator for your team ID — it is the only way in.`,
  backLabel: "Back",
  backAriaLabel: "Go back to the team options",
  schoolLabel: "School",
  schoolPlaceholder: "Search your school",
  checkLabel: "Check school",
  checkingLabel: "Checking…",
  slotsTitle: "Division slots",
  slotsTaken: "Taken",
  slotsFree: "Free",
  slotsHint: "One team per division per school.",
  slotUnavailable:
    "This school has no team in your division yet. Ask its coordinator to create one.",
  slotAvailable:
    "This school already fields a team in your division. Ask the coordinator for its team ID.",
  failure: "We could not check that school",
};

export const joinRequestCopy = {
  triggerLabel: "Request to join",
  dialogTitle: "Request to join",
  dialogDescription:
    "Your school coordinator or team leader confirms membership. Paste the team ID they shared with you and pick the specialty you want to own.",
  teamIdLabel: "Team ID",
  teamIdPlaceholder: "Paste the team ID",
  teamIdDescription: "Ask your school coordinator or team leader for it.",
  specialtyLabel: "Specialty",
  submitLabel: "Send request",
  submittingLabel: "Sending…",
  cancelLabel: "Cancel",
  success: "Request sent to the team leader",
  failure: "We could not send your request",
};

export const teamPanelCopy = {
  schoolFallback: "School",
  membersTitle: "Your team",
  teamMetaSuffix: "Your school",
  memberColumn: "Member",
  gradeColumn: "Grade",
  roleColumn: "Role",
  specialtyColumn: "Specialty",
  noSpecialtyLabel: "—",
  coverageCompleteTitle: "Specialty coverage complete.",
  coverageCompleteBody:
    "UI, architecture and business are all covered. Your team is ready to build and pitch together.",
  coverageMissingTitle: "Specialty coverage incomplete",
  coverageMissingPrefix: "Still open:",
  coverageMissingSuffix:
    "A new member should own one of these before the programme starts.",
  sizeWarningTitle: "Your team is still forming.",
  sizeWarningBody: `A team holds ${TEAM_MIN_MEMBERS} to ${TEAM_MAX_MEMBERS} members. Share your team's ID with classmates so they can send a join request.`,
  inviteBody:
    "Only the team leader approves join requests. Send them your team ID and tell them which specialty to claim.",
  leaderLeaveTitle: "Leaders must transfer leadership before leaving.",
  leaderLeaveBody:
    "Ask your school coordinator to move leadership to another member first. Teams need a named leader for the whole programme.",
  leaveLabel: "Leave team",
  leaveDialogTitle: "Leave this team?",
  leaveDialogDescription:
    "Your seat opens for another member. You can send a fresh join request later if there is still space.",
  leaveConfirmLabel: "Leave team",
  leaveCancelLabel: "Cancel",
  leavePendingLabel: "Leaving…",
  leaveSuccess: "You left the team",
  leaveFailure: "We could not leave the team",
};

export const joinRequestPanelCopy = {
  pendingTitle: "Pending join requests",
  decidedTitle: "Decided requests",
  gradePrefix: "Grade ",
  gradeColumn: "Grade",
  specialtyColumn: "Specialty",
  statusColumn: "Status",
  noSpecialty: "No specialty claimed",
  approveLabel: "Approve",
  rejectLabel: "Reject",
  decidingLabel: "Deciding…",
  approveSuccess: "Request approved",
  rejectSuccess: "Request rejected",
  failure: "We could not decide that request",
  emptyPending: "No pending requests right now.",
  emptyDecided: "Nothing decided yet.",
};

export const submissionCopy = {
  sectionKicker: "YOUR SUBMISSION",
  emptyTitle: "No submission yet",
  emptyDescription:
    "A team gets one submission. Your leader opens it as a draft, keeps it sharp, then forwards it to the school for review.",
  noTeamTitle: "You are not on a team yet",
  noTeamBody:
    "Create or join a team first. The team leader opens one submission for the whole team.",
  openLabel: "Open a submission",
  openDialogTitle: "Open a submission",
  openDialogDescription:
    "This creates a draft your team can keep refining until it is forwarded.",
  titleLabel: "Title",
  titlePlaceholder: "e.g. Smart flood alert",
  descriptionLabel: "What are you building?",
  repoLabel: "Repository URL",
  repoPlaceholder: "https://github.com/your-team/project",
  openSubmitLabel: "Open submission",
  openSubmittingLabel: "Opening…",
  cancelLabel: "Cancel",
  openSuccess: "Submission opened",
  failure: "We could not save the submission",
  editLabel: "Edit draft",
  editDialogTitle: "Edit the draft",
  editDialogDescription: "Only a draft can be edited.",
  editSubmitLabel: "Save changes",
  editSubmittingLabel: "Saving…",
  editSuccess: "Draft updated",
  forwardLabel: "Forward to school",
  forwardDialogTitle: "Forward to school",
  forwardDialogDescription:
    "Forwarding locks the draft and routes it to the school you pick for review.",
  schoolLabel: "School",
  schoolPlaceholder: "Search your school",
  schoolSlotsHint: "Which division slots the school has already used.",
  forwardSubmitLabel: "Forward submission",
  forwardSubmittingLabel: "Forwarding…",
  forwardSuccess: "Submission forwarded",
  nonLeaderTitle: "Your team leader manages the submission.",
  nonLeaderBody:
    "Everything here is read-only for you. Editing the draft and forwarding it for review stay with the team leader.",
  reviewNoteTitle: "Review note",
  titleRow: "Title",
  descriptionRow: "Description",
  repoRow: "Repository",
  forwardedRow: "Forwarded",
  reviewedRow: "Reviewed",
  noRepo: "No repository link yet",
  notForwarded: "Not forwarded yet",
  notReviewed: "Not reviewed yet",
  openRepoLabel: "Open the repository in a new tab",
};

export const validationCopy = {
  required: "Required",
  nameRequired: "Give your team a name",
  schoolRequired: "Pick your school",
  titleRequired: "Title is required",
  descriptionRequired: "Tell us what your team is building",
  repoUrlInvalid: "Enter a full URL starting with https://",
  teamIdRequired: "Paste the team ID from your school",
  specialtyRequired: "Pick the specialty you will own",
  incomplete: "Please complete the highlighted fields",
};

export const initialCreateTeamForm: CreateTeamForm = {
  name: "",
  schoolId: null,
};

export const initialSubmissionForm: SubmissionForm = {
  title: "",
  description: "",
  repoUrl: "",
};
