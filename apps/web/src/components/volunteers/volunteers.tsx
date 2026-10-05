import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { ApplicationForm } from "./application-form";
import type {
  ApplicationState,
  GuardianDetails,
  StudentDetails,
  VolunteerFormErrors,
  VolunteerPhoto,
} from "./data";
import {
  initialGuardian,
  initialStudent,
  roleLabels,
  validationCopy,
} from "./data";
import { Hero } from "./hero";
import { SuccessPanel } from "./success-panel";

type StudentErrors = Partial<Record<keyof StudentDetails, string>>;
type GuardianErrors = Partial<Record<keyof GuardianDetails, string>>;

const PHONE_PATTERN = /^(?:\+94|0)\d{9}$/u;
const EMAIL_PATTERN = /^[^@\s@]+@[^\s@]+\.[^\s@]+$/u;
const PHOTO_TYPES = new Set(["image/jpeg", "image/png"]);
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const REFERENCE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const isPhone = (value: string) =>
  PHONE_PATTERN.test(value.replaceAll(/[\s-]/gu, ""));

const photoIssue = (photo: VolunteerPhoto | null) => {
  if (photo === null) {
    return validationCopy.photoMissing;
  }
  if (!PHOTO_TYPES.has(photo.type)) {
    return validationCopy.photoType;
  }
  if (photo.size > MAX_PHOTO_BYTES) {
    return validationCopy.photoSize;
  }
  return null;
};

const validateStudent = (student: StudentDetails): StudentErrors => {
  const errors: StudentErrors = {};

  if (student.fullName.trim().length === 0) {
    errors.fullName = validationCopy.required;
  }
  if (student.school.trim().length === 0) {
    errors.school = validationCopy.required;
  }
  if (student.admissionNumber.trim().length === 0) {
    errors.admissionNumber = validationCopy.required;
  }
  if (student.grade === null) {
    errors.grade = validationCopy.required;
  }
  if (student.className.trim().length === 0) {
    errors.className = validationCopy.required;
  }
  if (student.contactNumber.trim().length === 0) {
    errors.contactNumber = validationCopy.required;
  } else if (!isPhone(student.contactNumber)) {
    errors.contactNumber = validationCopy.phone;
  }
  if (student.email.trim().length > 0 && !EMAIL_PATTERN.test(student.email)) {
    errors.email = validationCopy.email;
  }

  return errors;
};

const validateGuardian = (guardian: GuardianDetails): GuardianErrors => {
  const errors: GuardianErrors = {};

  if (guardian.name.trim().length === 0) {
    errors.name = validationCopy.required;
  }
  if (guardian.contactNumber.trim().length === 0) {
    errors.contactNumber = validationCopy.required;
  } else if (!isPhone(guardian.contactNumber)) {
    errors.contactNumber = validationCopy.phone;
  }
  if (
    guardian.alternateContactNumber.trim().length > 0 &&
    !isPhone(guardian.alternateContactNumber)
  ) {
    errors.alternateContactNumber = validationCopy.phone;
  }

  return errors;
};

const validateApplication = (state: ApplicationState): VolunteerFormErrors => {
  const errors: VolunteerFormErrors = {};
  const studentErrors = validateStudent(state.student);
  const guardianErrors = validateGuardian(state.guardian);
  const photoMessage = photoIssue(state.photo);

  if (state.teams.length === 0) {
    errors.teams = validationCopy.team;
  }
  if (photoMessage !== null) {
    errors.photo = photoMessage;
  }
  if (!state.consent) {
    errors.consent = validationCopy.consent;
  }
  if (Object.keys(studentErrors).length > 0) {
    errors.student = studentErrors;
  }
  if (Object.keys(guardianErrors).length > 0) {
    errors.guardian = guardianErrors;
  }

  return errors;
};

const createReference = () => {
  const year = String(new Date().getFullYear()).slice(-2);
  const number = 1000 + Math.floor(Math.random() * 9000);
  const suffix = Array.from(
    { length: 4 },
    () =>
      REFERENCE_ALPHABET[Math.floor(Math.random() * REFERENCE_ALPHABET.length)]
  ).join("");

  return `BQ${year}-V${number}-${suffix}`;
};

export const Volunteers = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [student, setStudent] = useState<StudentDetails>(initialStudent);
  const [guardian, setGuardian] = useState<GuardianDetails>(initialGuardian);
  const [consent, setConsent] = useState(false);
  const [photo, setPhoto] = useState<VolunteerPhoto | null>(null);
  const [errors, setErrors] = useState<VolunteerFormErrors>({});
  const [reference, setReference] = useState<string | null>(null);

  const handleStudentChange = (patch: Partial<StudentDetails>) => {
    setStudent((current) => ({ ...current, ...patch }));
    setErrors((current) => ({ ...current, student: undefined }));
  };

  const handleGuardianChange = (patch: Partial<GuardianDetails>) => {
    setGuardian((current) => ({ ...current, ...patch }));
    setErrors((current) => ({ ...current, guardian: undefined }));
  };

  const handleTeamsChange = (values: string[]) => {
    setTeams(values);
    setErrors((current) => ({ ...current, teams: undefined }));
  };

  const handleConsentChange = (checked: boolean) => {
    setConsent(checked);
    setErrors((current) => ({ ...current, consent: undefined }));
  };

  const handlePhotoChange = (file: File | null) => {
    if (photo !== null) {
      URL.revokeObjectURL(photo.url);
    }
    setPhoto(
      file === null
        ? null
        : {
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
          }
    );
    setErrors((current) => ({ ...current, photo: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateApplication({
      consent,
      guardian,
      photo,
      student,
      teams,
    });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      window.scrollTo({ top: 300, behavior: "smooth" });
      toast.error("Please complete the highlighted fields");
      return;
    }

    setReference(createReference());
    toast.success("Application received");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    if (photo !== null) {
      URL.revokeObjectURL(photo.url);
    }
    setTeams([]);
    setStudent(initialStudent);
    setGuardian(initialGuardian);
    setConsent(false);
    setPhoto(null);
    setErrors({});
    setReference(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="bg-ink overflow-x-hidden">
      <Hero />
      {reference === null ? (
        <ApplicationForm
          consent={consent}
          errors={errors}
          guardian={guardian}
          onConsentChange={handleConsentChange}
          onGuardianChange={handleGuardianChange}
          onPhotoChange={handlePhotoChange}
          onStudentChange={handleStudentChange}
          onSubmit={handleSubmit}
          onTeamsChange={handleTeamsChange}
          photo={photo}
          student={student}
          teams={teams}
        />
      ) : (
        <SuccessPanel
          onReset={handleReset}
          photo={photo}
          reference={reference}
          roles={roleLabels(teams)}
          student={student}
        />
      )}
    </main>
  );
};
