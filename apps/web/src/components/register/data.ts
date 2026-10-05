import type { BadgeTone } from "@byte-quest/ui/components/badge";
import type { SelectOption } from "@byte-quest/ui/components/fields";

export type Division = "junior" | "senior";

/**
 * Only these two may register a team: the team leader, or the school's MIC
 * (teacher in charge) acting on the school's behalf. Mirrors the
 * `canRegisterTeam` check on `access`.
 */
export type RegistrantRole = "leader" | "mic";

export type StepKey =
  | "account"
  | "school"
  | "division"
  | "team"
  | "students"
  | "teacher"
  | "review"
  | "confirmation";

export interface AccountDetails {
  role: RegistrantRole | null;
  fullName: string;
  email: string;
  username: string;
  password: string;
  nationalId: string;
  birthday: string;
  grade: string | null;
}

export interface SchoolDetails {
  name: string;
  province: string | null;
  district: string;
  address: string;
}

export interface TeamDetails {
  name: string;
  size: string;
  idea: string;
}

export interface MemberDetails {
  fullName: string;
  grade: string | null;
  className: string;
  admissionNumber: string;
}

export interface TeacherDetails {
  name: string;
  designation: string;
  phone: string;
  email: string;
  principal: string;
}

export interface RegisterState {
  account: AccountDetails;
  school: SchoolDetails;
  division: Division | null;
  team: TeamDetails;
  students: MemberDetails[];
  leaderIndex: number;
  teacher: TeacherDetails;
  consent: boolean;
}

export interface AccountErrors {
  role?: string;
  fullName?: string;
  email?: string;
  username?: string;
  password?: string;
  nationalId?: string;
  birthday?: string;
  grade?: string;
}

export interface SchoolErrors {
  name?: string;
  province?: string;
  district?: string;
}

export interface TeamErrors {
  name?: string;
}

export interface StudentErrors {
  fullName?: string;
  grade?: string;
}

export interface TeacherErrors {
  name?: string;
  designation?: string;
  phone?: string;
  email?: string;
}

export interface RegisterErrors {
  account?: AccountErrors;
  school?: SchoolErrors;
  division?: string;
  team?: TeamErrors;
  students?: Record<string, StudentErrors>;
  teacher?: TeacherErrors;
  consent?: string;
}

export interface HeroPill {
  label: string;
  tone: BadgeTone;
}

export interface StepContent {
  label: string;
  eyebrow: string;
  title: string;
  body: string;
}

export interface DivisionOption {
  value: Division;
  title: string;
  badge: string;
  description: string;
}

export interface NextStepItem {
  n: string;
  text: string;
}

export interface RegistrantRoleOption {
  value: RegistrantRole;
  badge: string;
  title: string;
  description: string;
}

const ACCOUNT_GRADES = ["6", "7", "8", "9", "10", "11", "12", "13"];

export const gradeOptionsForAccount: SelectOption[] = ACCOUNT_GRADES.map(
  (grade) => ({ label: `Grade ${grade}`, value: grade })
);

export const registerHero = {
  kicker: "TEAM REGISTRATION",
  title: "Register your team.",
  pills: [
    { label: "Junior · Grades 6–8", tone: "mint" },
    { label: "Senior · Grades 9–13", tone: "volt" },
    { label: "3–5 students per team", tone: "gold" },
  ],
} satisfies { kicker: string; title: string; pills: HeroPill[] };

export const registerSteps = {
  account: {
    label: "Your account",
    eyebrow: "01 / YOUR ACCOUNT",
    title: "Team leader or MIC?",
    body: "Only the team leader or the school's MIC (teacher in charge) registers a team. Ordinary students join afterwards.",
  },
  school: {
    label: "School",
    eyebrow: "02 / SCHOOL",
    title: "Which school are you representing?",
    body: "Teams register through their school.",
  },
  division: {
    label: "Division",
    eyebrow: "03 / DIVISION",
    title: "Choose your division.",
    body: "Every member of the team must be in the grades for that division.",
  },
  team: {
    label: "Team",
    eyebrow: "04 / TEAM",
    title: "Name your team.",
    body: "You can refine your project idea later in the programme.",
  },
  students: {
    label: "Students",
    eyebrow: "05 / STUDENTS",
    title: "Add your team members.",
    body: "Select one member as team leader. Student details are kept private.",
  },
  teacher: {
    label: "Teacher contact",
    eyebrow: "06 / TEACHER & SCHOOL CONTACT",
    title: "Who is the teacher in charge?",
    body: "All programme communication goes through the school contact.",
  },
  review: {
    label: "Review",
    eyebrow: "07 / REVIEW",
    title: "Check everything before you submit.",
    body: "Use Edit to go back to any section.",
  },
  confirmation: {
    label: "Confirmation",
    eyebrow: "08 / CONFIRMATION",
    title: "Registration received.",
    body: "Welcome to the quest, {teamName}. A confirmation will be sent to the teacher in charge.",
  },
} satisfies Record<StepKey, StepContent>;

export const stepOrder: StepKey[] = [
  "account",
  "school",
  "division",
  "team",
  "students",
  "teacher",
  "review",
  "confirmation",
];

export const stepList = stepOrder.map((key) => ({
  label: registerSteps[key].label,
}));

export const registerAside = {
  backLabel: "← Back",
  continueLabel: "Continue →",
  createAccountLabel: "Create my account →",
  submitLabel: "Submit registration →",
};

export const accountRoles: RegistrantRoleOption[] = [
  {
    value: "leader",
    badge: "TEAM LEADER",
    title: "Team leader",
    description: "I lead my team and will register it on our school's behalf.",
  },
  {
    value: "mic",
    badge: "MASTER-IN-CHARGE",
    title: "MIC (teacher in charge)",
    description:
      "I am the teacher in charge and register the team for my school.",
  },
];

export const accountCopy = {
  usernameHint:
    "Letters, digits, dots, underscores or hyphens. This is how you sign in.",
  passwordHint: "At least 8 characters.",
  birthdayHint: "Use the YYYY-MM-DD format.",
  studentsNote:
    "Students do not register their own team. They sign in and ask to join yours.",
  gradeOptions: gradeOptionsForAccount,
};

export const registrantRoleLabels: Record<RegistrantRole, string> = {
  leader: "Team Leader",
  mic: "MIC (Teacher in charge)",
};

export const validationCopy = {
  required: "Required",
  division: "Choose a division.",
  divisionGrade: "Not in this division",
  phone: "Enter a valid Sri Lankan number",
  email: "Enter a valid email",
  consent: "Please confirm to submit.",
  incomplete: "Please complete the highlighted fields",
  registrantRole: "Only a team leader or a MIC can register a team.",
  username:
    "Use letters, digits, dots, underscores or hyphens, starting with a letter or digit.",
  usernameLength: "Username must be at least 3 characters.",
  password: "Password must be at least 8 characters.",
  birthday: "Use the YYYY-MM-DD format.",
};

export const consentCopy =
  "The teacher in charge confirms these details are correct, that the school approves this registration, and that the team agrees to the BYTE QUEST terms and code of conduct.";

export const teamSizeHint = "Students per team: minimum 3, maximum 5.";

export const reviewTitles = {
  school: "SCHOOL",
  division: "DIVISION",
  team: "TEAM",
  students: "STUDENTS",
  teacher: "TEACHER CONTACT",
};

export const reviewEditLabel = "EDIT";

export const confirmationCopy = {
  fallbackTeam: "team",
  referenceLabel: "REFERENCE",
  teamLabel: "TEAM",
  divisionLabel: "DIVISION",
  schoolLabel: "SCHOOL",
  leaderLabel: "TEAM LEADER",
  statusLabel: "STATUS",
  statusValue: "Pending verification",
  nextStepsLabel: "NEXT STEPS",
  nextSteps: [
    {
      n: "01",
      text: "The organising committee verifies your registration with the school.",
    },
    { n: "02", text: "Your teacher in charge receives orientation details." },
    { n: "03", text: "Week 1: Opening Ceremony & Team Formation." },
  ],
  journeyLabel: "Explore the journey →",
  journeyAriaLabel: "Explore the BYTE QUEST journey",
  resetLabel: "Register another team",
};

const provinceNames = [
  "Western",
  "Southern",
  "Central",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
];

export const provinceOptions: SelectOption[] = provinceNames.map((name) => ({
  value: name,
  label: name,
}));

export const divisionOptions: DivisionOption[] = [
  {
    value: "junior",
    title: "Junior",
    badge: "GRADES 6–8",
    description:
      "Create a game or application that makes learning fun or solves a daily problem.",
  },
  {
    value: "senior",
    title: "Senior",
    badge: "GRADES 9–13",
    description: "Innovate for the Sustainable Development Goals.",
  },
];

export const divisionLabels: Record<Division, string> = {
  junior: "Junior · Grades 6–8",
  senior: "Senior · Grades 9–13",
};

export const divisionGrades: Record<Division, string[]> = {
  junior: ["6", "7", "8"],
  senior: ["9", "10", "11", "12", "13"],
};

export const platformsByDivision: Record<Division, string[]> = {
  junior: ["Scratch", "MIT App Inventor"],
  senior: ["Web", "Mobile", "Python", "AI", "IoT", "Robotics", "Desktop"],
};

const gradeOptionsByDivision: Record<Division, SelectOption[]> = {
  junior: divisionGrades.junior.map((grade) => ({
    value: grade,
    label: `Grade ${grade}`,
  })),
  senior: divisionGrades.senior.map((grade) => ({
    value: grade,
    label: `Grade ${grade}`,
  })),
};

export const gradeOptionsForDivision = (
  division: Division | null
): SelectOption[] =>
  division === null ? [] : gradeOptionsByDivision[division];

export const teamSizeOptions: SelectOption[] = ["3", "4", "5"].map((size) => ({
  value: size,
  label: size,
}));

export const createEmptyMember = (): MemberDetails => ({
  fullName: "",
  grade: null,
  className: "",
  admissionNumber: "",
});

export const initialRegisterState: RegisterState = {
  account: {
    role: null,
    fullName: "",
    email: "",
    username: "",
    password: "",
    nationalId: "",
    birthday: "",
    grade: null,
  },
  school: { name: "", province: null, district: "", address: "" },
  division: null,
  team: { name: "", size: "3", idea: "" },
  students: [createEmptyMember(), createEmptyMember(), createEmptyMember()],
  leaderIndex: 0,
  teacher: {
    name: "",
    designation: "",
    phone: "",
    email: "",
    principal: "",
  },
  consent: false,
};

export const studentLabel = (index: number): string => `Student ${index + 1}`;

export const leaderLabel = (index: number): string =>
  `Student ${index + 1} · Leader`;

export const teamSizeSummary = (size: string): string => `${size} students`;

export const divisionSummary = (division: Division | null): string =>
  division === null ? "" : divisionLabels[division];

export const memberSummary = (member: MemberDetails): string => {
  const grade = member.grade === null ? "" : `Grade ${member.grade}`;
  const parts = [member.fullName.trim(), grade, member.className.trim()].filter(
    (part) => part.length > 0
  );
  return parts.length > 0 ? parts.join(" · ") : "";
};

export const confirmationBody = (teamName: string): string =>
  registerSteps.confirmation.body.replaceAll(
    "{teamName}",
    teamName.trim().length > 0 ? teamName.trim() : confirmationCopy.fallbackTeam
  );
