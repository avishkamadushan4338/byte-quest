import type { FormEvent, ReactNode } from "react";

import { InputField, SelectField } from "@/components/site/design-fields";

import type {
  GuardianDetails,
  StudentDetails,
  VolunteerFormErrors,
  VolunteerPhoto,
} from "./data";
import {
  applicationAside,
  applicationChecklist,
  consentCopy,
  formSections,
  gradeOptions,
  relationshipOptions,
  teamOptions,
  validationCopy,
} from "./data";

interface ApplicationFormProps {
  consent: boolean;
  errors: VolunteerFormErrors;
  guardian: GuardianDetails;
  onConsentChange: (checked: boolean) => void;
  onGuardianChange: (patch: Partial<GuardianDetails>) => void;
  onPhotoChange: (file: File | null) => void;
  onStudentChange: (patch: Partial<StudentDetails>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onTeamsChange: (teams: string[]) => void;
  pending?: boolean;
  photo: VolunteerPhoto | null;
  student: StudentDetails;
  teams: string[];
}

interface FormCardProps {
  step: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

const TOTAL_PROGRESS_STEPS = 5;

const panelClass =
  "bg-surface rounded-[20px] border border-[rgba(185,245,208,0.09)] p-[clamp(20px,3vw,32px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

const gridClass =
  "grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4";

const FormCard = ({ step, title, subtitle, children }: FormCardProps) => (
  <div className={panelClass}>
    <div className="mb-[22px] flex items-start gap-4">
      <span className="text-volt flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(82,255,61,0.35)] font-mono text-[12px]">
        {step}
      </span>
      <div>
        <h2 className="font-display m-0 text-[21px] font-semibold tracking-[-0.01em]">
          {title}
        </h2>
        <div className="text-muted-2 mt-1 text-[13.5px]">{subtitle}</div>
      </div>
    </div>
    {children}
  </div>
);

export const ApplicationForm = ({
  consent,
  errors,
  guardian,
  onConsentChange,
  onGuardianChange,
  onPhotoChange,
  onStudentChange,
  onSubmit,
  onTeamsChange,
  pending,
  photo,
  student,
  teams,
}: ApplicationFormProps) => {
  const checklist = applicationChecklist({
    consent,
    guardian,
    photo,
    student,
    teams,
  });
  const completed =
    checklist.filter((item) => item.done).length + (consent ? 1 : 0);
  const percent = `${(completed / TOTAL_PROGRESS_STEPS) * 100}%`;
  const photoError = errors.photo;

  const toggleTeam = (value: string) => {
    onTeamsChange(
      teams.includes(value)
        ? teams.filter((team) => team !== value)
        : [...teams, value]
    );
  };

  return (
    <section
      className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,112px)]"
      id="apply"
    >
      <form
        className="mx-auto flex max-w-[1280px] flex-wrap items-start gap-5"
        noValidate
        onSubmit={onSubmit}
      >
        <div className="grid min-w-0 flex-[3_1_560px] gap-4">
          <FormCard
            step={formSections.team.step}
            subtitle={formSections.team.subtitle}
            title={formSections.team.title}
          >
            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-2.5">
              {teamOptions.map((option) => {
                const on = teams.includes(option.value);
                const border = on
                  ? "rgba(82,255,61,0.55)"
                  : "rgba(185,245,208,0.12)";
                return (
                  <label
                    className="text-fg has-[:focus-visible]:outline-volt relative flex cursor-pointer flex-col gap-1.5 rounded-[14px] p-4 text-left font-sans transition-all duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px]"
                    key={option.value}
                    style={{
                      background: on ? "rgba(82,255,61,0.07)" : "#020807",
                      border: `1px solid ${border}`,
                    }}
                  >
                    <input
                      checked={on}
                      className="sr-only"
                      onChange={() => toggleTeam(option.value)}
                      type="checkbox"
                    />
                    <span
                      aria-hidden="true"
                      className="text-ink absolute top-3.5 right-3.5 flex size-5 items-center justify-center rounded-[6px] text-[12px] font-bold"
                      style={{
                        border: `1px solid ${border}`,
                        background: on ? "#52FF3D" : "transparent",
                      }}
                    >
                      {on ? "✓" : ""}
                    </span>
                    <span className="font-display pr-7 text-[16px] font-semibold">
                      {option.title}
                    </span>
                    <span className="text-muted-2 text-[12.5px] leading-[1.45]">
                      {option.description}
                    </span>
                  </label>
                );
              })}
            </div>
            <div
              className="mt-2.5 min-h-4 text-[12px] text-[#FF8A7A]"
              role="alert"
            >
              {errors.teams}
            </div>
          </FormCard>

          <FormCard
            step={formSections.student.step}
            subtitle={formSections.student.subtitle}
            title={formSections.student.title}
          >
            <div className={gridClass}>
              <InputField
                autoComplete="name"
                error={errors.student?.fullName}
                id="full-name"
                label="Full name"
                onValueChange={(value) => onStudentChange({ fullName: value })}
                placeholder="As in school records"
                requirement="required"
                value={student.fullName}
              />
              <InputField
                error={errors.student?.admissionNumber}
                id="admission-number"
                label="Admission number"
                onValueChange={(value) =>
                  onStudentChange({ admissionNumber: value })
                }
                placeholder="e.g. 12345"
                requirement="required"
                value={student.admissionNumber}
              />
              <SelectField
                error={errors.student?.grade}
                id="grade"
                label="Grade"
                onValueChange={(value) =>
                  onStudentChange({ grade: value || null })
                }
                options={gradeOptions}
                requirement="required"
                value={student.grade ?? ""}
              />
              <InputField
                error={errors.student?.className}
                id="class"
                label="Class"
                onValueChange={(value) => onStudentChange({ className: value })}
                placeholder="e.g. 10B"
                requirement="required"
                value={student.className}
              />
              <InputField
                autoComplete="tel"
                error={errors.student?.contactNumber}
                id="contact-number"
                inputMode="tel"
                label="Contact number"
                onValueChange={(value) =>
                  onStudentChange({ contactNumber: value })
                }
                placeholder="07XXXXXXXX"
                requirement="required"
                type="tel"
                value={student.contactNumber}
              />
              <InputField
                autoComplete="email"
                error={errors.student?.email}
                id="email"
                inputMode="email"
                label="Email"
                onValueChange={(value) => onStudentChange({ email: value })}
                placeholder="you@example.com"
                requirement="optional"
                type="email"
                value={student.email}
              />
            </div>
          </FormCard>

          <FormCard
            step={formSections.guardian.step}
            subtitle={formSections.guardian.subtitle}
            title={formSections.guardian.title}
          >
            <div className={gridClass}>
              <InputField
                autoComplete="name"
                error={errors.guardian?.name}
                id="guardian-name"
                label="Parent / guardian name"
                onValueChange={(value) => onGuardianChange({ name: value })}
                placeholder="Full name"
                requirement="required"
                value={guardian.name}
              />
              <SelectField
                id="guardian-relationship"
                label="Relationship"
                onValueChange={(value) =>
                  onGuardianChange({ relationship: value || null })
                }
                options={relationshipOptions}
                requirement="optional"
                value={guardian.relationship ?? ""}
              />
              <InputField
                autoComplete="tel"
                error={errors.guardian?.contactNumber}
                id="guardian-contact"
                inputMode="tel"
                label="Parent / guardian contact number"
                onValueChange={(value) =>
                  onGuardianChange({ contactNumber: value })
                }
                placeholder="07XXXXXXXX"
                requirement="required"
                type="tel"
                value={guardian.contactNumber}
              />
              <InputField
                autoComplete="tel"
                error={errors.guardian?.alternateContactNumber}
                id="alternate-contact"
                inputMode="tel"
                label="Alternate contact number"
                onValueChange={(value) =>
                  onGuardianChange({ alternateContactNumber: value })
                }
                placeholder="07XXXXXXXX"
                requirement="optional"
                type="tel"
                value={guardian.alternateContactNumber}
              />
            </div>
          </FormCard>

          <FormCard
            step={formSections.photo.step}
            subtitle={formSections.photo.subtitle}
            title={formSections.photo.title}
          >
            <div className="flex flex-wrap items-center gap-5">
              <div
                className="flex h-[150px] w-[120px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-dashed"
                style={{
                  borderColor: photoError
                    ? "rgba(255,138,122,0.6)"
                    : "rgba(185,245,208,0.2)",
                  background:
                    "repeating-linear-gradient(135deg,#061C16 0 8px,#04140F 8px 16px)",
                }}
              >
                {photo ? (
                  <img
                    alt={validationCopy.photoAlt}
                    className="size-full object-cover"
                    src={photo.url}
                  />
                ) : (
                  <span className="text-faint-2 font-mono text-[10px] tracking-[0.1em]">
                    {validationCopy.photoPlaceholder}
                  </span>
                )}
              </div>
              <div className="flex min-w-40 shrink-0 flex-col gap-2.5">
                <label
                  className="text-fg hover:border-volt relative inline-flex w-fit cursor-pointer items-center gap-2.5 rounded-full border border-[rgba(242,247,244,0.25)] px-[18px] py-3 text-[14px] font-semibold whitespace-nowrap"
                  htmlFor="volunteer-photo"
                >
                  {photo
                    ? validationCopy.fileLabelChanged
                    : validationCopy.fileLabelSelected}
                  <input
                    accept="image/jpeg,image/png"
                    className="absolute size-px opacity-0"
                    id="volunteer-photo"
                    onChange={(event) =>
                      onPhotoChange(event.currentTarget.files?.[0] ?? null)
                    }
                    type="file"
                  />
                </label>
                <span className="text-muted-2 text-[12.5px]">
                  {photo?.name ?? validationCopy.fileLabelEmpty}
                </span>
                <span
                  className="min-h-4 text-[12px] text-[#FF8A7A]"
                  role="alert"
                >
                  {photoError}
                </span>
              </div>
            </div>
          </FormCard>
        </div>

        <aside
          className={`${panelClass} sticky top-[100px] flex max-w-full flex-[1_1_300px] flex-col gap-[18px]`}
        >
          <div className="text-muted-2 font-mono text-[11px] tracking-[0.16em]">
            {applicationAside.kicker}
          </div>
          <div className="grid gap-2.5">
            {checklist.map((item) => (
              <div
                className="flex items-center gap-3 text-[14px]"
                key={item.label}
                style={{ color: item.done ? "#F2F7F4" : "#8FA79C" }}
              >
                <span
                  className="text-ink flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{
                    background: item.done ? "#52FF3D" : "transparent",
                    border: `1px solid ${item.done ? "#52FF3D" : "rgba(185,245,208,0.25)"}`,
                  }}
                >
                  {item.done ? "✓" : ""}
                </span>
                {item.label}
              </div>
            ))}
          </div>
          <div className="h-1 overflow-hidden rounded-[4px] bg-[rgba(185,245,208,0.08)]">
            <div
              className="h-full bg-[linear-gradient(90deg,#00A99A,#52FF3D)] transition-[width] duration-300"
              style={{ width: percent }}
            />
          </div>
          <label className="text-muted flex cursor-pointer items-start gap-3 text-[13px] leading-[1.5]">
            <input
              checked={consent}
              className="accent-volt mt-[3px] size-4 shrink-0"
              onChange={(event) => onConsentChange(event.target.checked)}
              type="checkbox"
            />
            <span>{consentCopy}</span>
          </label>
          <span
            className="-mt-2.5 min-h-3.5 text-[12px] text-[#FF8A7A]"
            role="alert"
          >
            {errors.consent}
          </span>
          <button
            aria-busy={pending}
            className="bg-volt text-ink hover:bg-lime cursor-pointer rounded-full border-none px-[22px] py-[15px] font-sans text-[15px] font-bold disabled:cursor-default disabled:opacity-60"
            disabled={pending}
            type="submit"
          >
            {applicationAside.submitLabel}
          </button>
          <p className="text-faint m-0 text-[12px] leading-[1.55]">
            {applicationAside.privacyNote}
          </p>
        </aside>
      </form>
    </section>
  );
};
