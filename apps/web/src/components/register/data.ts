import type { FieldOption } from "@/components/site/design-fields";

export type Division = "junior" | "senior";

export type StepKey =
  | "school"
  | "division"
  | "team"
  | "students"
  | "teacher"
  | "review"
  | "confirmation";

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
  school: SchoolDetails;
  divisions: Division[];
  teams: Record<Division, TeamDetails>;
  students: Record<Division, MemberDetails[]>;
  leaderIndex: Record<Division, number>;
  teacher: TeacherDetails;
  consent: boolean;
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
  className?: string;
  admissionNumber?: string;
}

export interface TeacherErrors {
  name?: string;
  designation?: string;
  phone?: string;
  email?: string;
}

export interface RegisterErrors {
  school?: SchoolErrors;
  divisions?: string;
  teams?: Partial<Record<Division, TeamErrors>>;
  students?: Partial<Record<Division, Record<string, StudentErrors>>>;
  teacher?: TeacherErrors;
  consent?: string;
}

export interface HeroPill {
  label: string;
  color: string;
  line: string;
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
  color: string;
  line: string;
}

export interface NextStepItem {
  n: string;
  text: string;
}

export const registerHero = {
  kicker: "TEAM REGISTRATION",
  title: "Register your team.",
  pills: [
    {
      label: "Junior · Grades 6–8",
      color: "#D5E1DB",
      line: "rgba(185,245,208,0.2)",
    },
    {
      label: "Senior · Grades 9–13",
      color: "#52FF3D",
      line: "rgba(82,255,61,0.3)",
    },
    {
      label: "3–5 students per team",
      color: "#F0D875",
      line: "rgba(212,175,55,0.3)",
    },
  ],
} satisfies { kicker: string; title: string; pills: HeroPill[] };

export const registerSteps = {
  school: {
    label: "School",
    eyebrow: "01 / SCHOOL",
    title: "Which school are you representing?",
    body: "Teams register through their school.",
  },
  division: {
    label: "Division",
    eyebrow: "02 / DIVISION",
    title: "Choose your division.",
    body: "Pick one, or both if your school is fielding a Junior and a Senior team. Every member of a team must be in the grades for that division.",
  },
  team: {
    label: "Team",
    eyebrow: "03 / TEAM",
    title: "Name your team(s).",
    body: "You can refine your project idea later in the programme.",
  },
  students: {
    label: "Students",
    eyebrow: "04 / STUDENTS",
    title: "Add your team members.",
    body: "Select one member as team leader. Student details are kept private.",
  },
  teacher: {
    label: "Teacher contact",
    eyebrow: "05 / TEACHER & SCHOOL CONTACT",
    title: "Who is the teacher in charge?",
    body: "All programme communication goes through the school contact.",
  },
  review: {
    label: "Review",
    eyebrow: "06 / REVIEW",
    title: "Check everything before you submit.",
    body: "Use Edit to go back to any section.",
  },
  confirmation: {
    label: "Confirmation",
    eyebrow: "07 / CONFIRMATION",
    title: "Registration received.",
    body: "Welcome to the quest, {teamName}. A confirmation will be sent to the teacher in charge.",
  },
} satisfies Record<StepKey, StepContent>;

export const stepOrder: StepKey[] = [
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
  backLabel: "\u2190 Back",
  continueLabel: "Continue \u2192",
  submitLabel: "Submit registration \u2192",
};

export const validationCopy = {
  required: "Required",
  division: "Choose at least one division.",
  divisionGrade: "Not in this division",
  phone: "Enter a valid Sri Lankan number",
  email: "Enter a valid email",
  consent: "Please confirm to submit.",
  incomplete: "Please complete the highlighted fields",
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

export const provinceOptions: FieldOption[] = provinceNames.map((name) => ({
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
    color: "#B9F5D0",
    line: "rgba(185,245,208,0.3)",
  },
  {
    value: "senior",
    title: "Senior",
    badge: "GRADES 9–13",
    description: "Innovate for the Sustainable Development Goals.",
    color: "#52FF3D",
    line: "rgba(82,255,61,0.3)",
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

/** Fixed display/iteration order, independent of selection order. */
export const divisionOrder: Division[] = ["junior", "senior"];

export const platformsByDivision: Record<Division, string[]> = {
  junior: ["Scratch", "MIT App Inventor"],
  senior: ["Web", "Mobile", "Python", "AI", "IoT", "Robotics", "Desktop"],
};

const gradeOptionsByDivision: Record<Division, FieldOption[]> = {
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
): FieldOption[] => (division === null ? [] : gradeOptionsByDivision[division]);

export const teamSizeOptions: FieldOption[] = ["3", "4", "5"].map((size) => ({
  value: size,
  label: size,
}));

export const createEmptyMember = (): MemberDetails => ({
  fullName: "",
  grade: null,
  className: "",
  admissionNumber: "",
});

const createEmptyTeam = (): TeamDetails => ({ name: "", size: "3", idea: "" });

const createEmptyRoster = (): MemberDetails[] => [
  createEmptyMember(),
  createEmptyMember(),
  createEmptyMember(),
];

export const initialRegisterState: RegisterState = {
  school: { name: "", province: null, district: "", address: "" },
  divisions: [],
  teams: { junior: createEmptyTeam(), senior: createEmptyTeam() },
  students: { junior: createEmptyRoster(), senior: createEmptyRoster() },
  leaderIndex: { junior: 0, senior: 0 },
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

export const divisionSummary = (division: Division): string =>
  divisionLabels[division];

export const memberSummary = (member: MemberDetails): string => {
  const grade = member.grade === null ? "" : `Grade ${member.grade}`;
  const parts = [member.fullName.trim(), grade, member.className.trim()].filter(
    (part) => part.length > 0
  );
  return parts.length > 0 ? parts.join(" · ") : "";
};
