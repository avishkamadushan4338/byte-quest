export interface StudentDetails {
  fullName: string;
  school: string;
  admissionNumber: string;
  grade: string | null;
  className: string;
  contactNumber: string;
  email: string;
}

export interface GuardianDetails {
  name: string;
  relationship: string | null;
  contactNumber: string;
  alternateContactNumber: string;
}

export interface VolunteerPhoto {
  name: string;
  url: string;
  dataUrl?: string;
  size: number;
  type: string;
}

export interface VolunteerFormErrors {
  teams?: string;
  student?: Partial<Record<keyof StudentDetails, string>>;
  guardian?: Partial<Record<keyof GuardianDetails, string>>;
  photo?: string;
  consent?: string;
}

export interface ApplicationState {
  teams: string[];
  student: StudentDetails;
  guardian: GuardianDetails;
  consent: boolean;
  photo: VolunteerPhoto | null;
}

export interface TeamOption {
  value: string;
  title: string;
  description: string;
}

export interface ChecklistItem {
  label: string;
  done: boolean;
}

export const volunteerHero = {
  kicker: "STUDENT VOLUNTEERS",
  title: "Join the crew behind the quest.",
  lead: "Help create, present, design and run BYTE QUEST. Choose the teams you'd like to join and tell us about yourself.",
};

export const formSections = {
  team: {
    step: "01",
    title: "Choose your team",
    subtitle: "Select one or more. You may be placed based on need.",
    legend: "Teams",
  },
  student: {
    step: "02",
    title: "Student details",
    subtitle: "As they appear in school records.",
  },
  guardian: {
    step: "03",
    title: "Parent / guardian",
    subtitle: "Used only to contact your family about volunteering.",
  },
  photo: {
    step: "04",
    title: "Your photo",
    subtitle:
      "A clear, recent photo for your volunteer ID. JPG or PNG, max 5 MB.",
  },
};

export const applicationAside = {
  kicker: "YOUR APPLICATION",
  progressLabel: "Completion",
  submitLabel: "Submit application →",
  privacyNote:
    "Your details are private, never shown publicly, and only used by the organising committee to coordinate volunteers.",
};

export const successPanel = {
  kicker: "YOU'RE ON THE CREW",
  titleStart: "Welcome,",
  body: "Under review",
  statusLabel: "STATUS",
  statusValue: "Under review",
  idLabel: "APPLICATION REF",
  downloadLabel: "Download ID card ↓",
  resetLabel: "Submit another response",
  fallbackName: "crew member",
};

export const idCard = {
  schoolLine: "ST. ALOYSIUS' COLLEGE · OBA",
  chip: "VOLUNTEER",
  idLabel: "ID NUMBER",
  classLabel: "CLASS",
  admissionLabel: "ADM NO",
  schoolLabel: "SCHOOL",
  tagline: "LEARN. BUILD. INNOVATE. INSPIRE.",
  photoAlt: "Volunteer photo",
  crestSrc: "/assets/crest.webp",
};

export const consentCopy =
  "My parent/guardian and I confirm these details are correct and agree to the volunteer code of conduct.";

export const validationCopy = {
  team: "Choose at least one team.",
  required: "Required",
  phone: "Enter a valid Sri Lankan number, e.g. 07XXXXXXXX",
  email: "Enter a valid email",
  photoType: "Please upload a JPG or PNG image.",
  photoSize: "Image must be 5 MB or smaller.",
  photoMissing: "Please upload a photo.",
  consent: "Please confirm to continue.",
  fileLabelEmpty: "No file selected",
  fileLabelSelected: "Upload photo",
  fileLabelChanged: "Change photo",
  photoPlaceholder: "PHOTO",
  photoAlt: "Your uploaded photo",
};

export const teamOptions: TeamOption[] = [
  {
    value: "content-creator",
    title: "Content Creator",
    description: "Write posts, captions and stories for our channels.",
  },
  {
    value: "video-editor",
    title: "Video Editor",
    description: "Edit highlight reels, recaps and promos.",
  },
  {
    value: "presenters",
    title: "Presenters & Compering",
    description: "Host sessions and present on stage.",
  },
  {
    value: "media-crew",
    title: "Media Crew",
    description: "Photography and video coverage at events.",
  },
  {
    value: "design-team",
    title: "Design Team",
    description: "Create graphics, posters and visual assets.",
  },
  {
    value: "programme-logistics",
    title: "Programme & Logistics",
    description: "Plan schedules, venues and event flow.",
  },
  {
    value: "showcase-team",
    title: "Showcase Team",
    description: "Set up and run the Innovation Expo showcase.",
  },
];

export const gradeOptions = Array.from({ length: 8 }, (_, index) => ({
  value: String(index + 6),
  label: `Grade ${index + 6}`,
}));

export const relationshipOptions = [
  { value: "mother", label: "Mother" },
  { value: "father", label: "Father" },
  { value: "guardian", label: "Guardian" },
];

export const initialStudent: StudentDetails = {
  fullName: "",
  school: "St. Aloysius' College, Galle",
  admissionNumber: "",
  grade: null,
  className: "",
  contactNumber: "",
  email: "",
};

export const initialGuardian: GuardianDetails = {
  name: "",
  relationship: null,
  contactNumber: "",
  alternateContactNumber: "",
};

export const roleLabels = (teams: string[]): string[] =>
  teams
    .map((team) => teamOptions.find((option) => option.value === team)?.title)
    .filter((title): title is string => Boolean(title));

export const applicationChecklist = (
  state: ApplicationState
): ChecklistItem[] => {
  const hasStudentDetails = [
    state.student.fullName,
    state.student.admissionNumber,
    state.student.className,
    state.student.contactNumber,
    state.student.grade ?? "",
  ].every((entry) => entry.trim().length > 0);

  const hasGuardianDetails = [
    state.guardian.name,
    state.guardian.contactNumber,
  ].every((entry) => entry.trim().length > 0);

  return [
    { label: "Team selected", done: state.teams.length > 0 },
    { label: "Student details", done: hasStudentDetails },
    { label: "Parent / guardian", done: hasGuardianDetails },
    { label: "Photo uploaded", done: state.photo !== null },
  ];
};
