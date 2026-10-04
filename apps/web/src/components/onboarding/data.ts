import type { SelectOption } from "@byte-quest/ui/components/fields";

export interface ProfileDetails {
  fullName: string;
  nationalId: string;
  birthday: string;
  grade: string | null;
}

export interface ProfileErrors {
  fullName?: string;
  nationalId?: string;
  birthday?: string;
  grade?: string;
}

export const onboardingHero = {
  kicker: "YOUR PROFILE",
  title: "Complete your profile.",
  lead: "BYTE QUEST needs a few details before you can join a team or submit a project. They stay private and are never shown publicly.",
};

export const onboardingAside = {
  kicker: "WHAT HAPPENS NEXT",
  checklistLabels: [
    "Create your profile",
    "Join or create a team",
    "Draft your submission",
  ],
  calloutTitle: "Why we ask",
  calloutBody:
    "Identification data is required for the Grand Final and is only visible to the organising committee.",
};

export const profileCopy = {
  submitLabel: "Save my profile",
  submittingLabel: "Saving…",
  skipLabel: "Skip for now",
  skipAriaLabel: "Skip onboarding and return to the home page",
  successMessage: "Profile created",
  failureMessage: "We could not create your profile",
  incomplete: "Please complete the highlighted fields",
};

export const profileValidation = {
  required: "Required",
  birthday: "Use the YYYY-MM-DD format",
};

export const gradeOptions: SelectOption[] = Array.from(
  { length: 8 },
  (_, index) => ({
    value: String(index + 6),
    label: `Grade ${index + 6}`,
  })
);

export const initialProfile: ProfileDetails = {
  fullName: "",
  nationalId: "",
  birthday: "",
  grade: null,
};
