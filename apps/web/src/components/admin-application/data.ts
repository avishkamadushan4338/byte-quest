export interface ApplicationFields {
  fullName: string;
  email: string;
  username: string;
  organization: string;
  role: string;
  experience: string;
}

export interface ApplicationErrors {
  fullName?: string;
  email?: string;
  username?: string;
  organization?: string;
  role?: string;
  experience?: string;
}

export interface ApplicationStep {
  n: string;
  title: string;
  detail: string;
}

export const initialApplication: ApplicationFields = {
  fullName: "",
  email: "",
  username: "",
  organization: "",
  role: "",
  experience: "",
};

export const adminApplyCopy = {
  kicker: "ORGANISING COMMITTEE",
  title: "Apply for admin access.",
  lede: "Admin access is granted only by the organising committee. Anyone can apply — an existing admin reviews every application.",
  submit: "Submit application →",
  required: "Required",
  email: "Enter a valid email",
  username:
    "Use letters, digits, dots, underscores or hyphens, starting with a letter or digit.",
  usernameLength: "Username must be at least 3 characters.",
  experience: "Please write at least a couple of sentences.",
  experienceHint: "A couple of sentences is enough.",
  usernameHint: "This is how you will sign in once approved.",
  incomplete: "Please complete the highlighted fields",
  failed: "We could not submit your application. Please try again.",
  received: "Application received",
  receivedTitle: "Apply for the committee.",
  approvalNote:
    "There is no open admin signup. An existing admin must approve your application before the account is created.",
  steps: [
    {
      n: "01",
      title: "You apply",
      detail: "Tell us who you are and why you want to help run the programme.",
    },
    {
      n: "02",
      title: "An admin reviews it",
      detail:
        "The organising committee checks your application against programme needs.",
    },
    {
      n: "03",
      title: "Account is provisioned",
      detail:
        "On approval we create your admin account and share a one-time password.",
    },
  ] satisfies ApplicationStep[],
};
