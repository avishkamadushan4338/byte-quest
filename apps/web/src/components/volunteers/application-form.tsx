import { Card } from "@byte-quest/ui/components/card";
import { Container } from "@byte-quest/ui/components/container";
import {
  CheckboxField,
  OptionToggleField,
  SelectField,
  TextField,
} from "@byte-quest/ui/components/fields";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { Section } from "@byte-quest/ui/components/section";
import { Checklist, ProgressMeter } from "@byte-quest/ui/components/steps";
import { Button } from "@byte-quest/ui/primitives/button";
import type { FormEvent } from "react";

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
  photo: VolunteerPhoto | null;
  student: StudentDetails;
  teams: string[];
}

const cardClasses =
  "rounded-[20px] border-line-soft p-[clamp(20px,3vw,32px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]";

const chipClasses =
  "border-volt/35 text-volt flex size-9 shrink-0 items-center justify-center rounded-[10px] border font-mono text-[12px]";

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
  const completedSteps = checklist.filter((item) => item.done).length;

  return (
    <Section id="apply">
      <Container>
        <form className="flex flex-wrap items-start gap-5" onSubmit={onSubmit}>
          <div className="grid flex-[3_1_560px] gap-4">
            <Card className={cardClasses}>
              <div className="mb-[22px] flex items-start gap-3.5">
                <span className={chipClasses}>{formSections.team.step}</span>
                <div>
                  <h2 className="font-display text-fg text-[21px] font-semibold tracking-[-0.02em]">
                    {formSections.team.title}
                  </h2>
                  <p className="text-muted-2 mt-1 text-[13.5px] leading-[1.5]">
                    {formSections.team.subtitle}
                  </p>
                </div>
              </div>
              <OptionToggleField
                columns="minmax(min(100%,240px),1fr)"
                error={errors.teams}
                legend={formSections.team.legend}
                onValuesChange={onTeamsChange}
                options={teamOptions}
                values={teams}
              />
            </Card>

            <Card className={cardClasses}>
              <div className="mb-[22px] flex items-start gap-3.5">
                <span className={chipClasses}>{formSections.student.step}</span>
                <div>
                  <h2 className="font-display text-fg text-[21px] font-semibold tracking-[-0.02em]">
                    {formSections.student.title}
                  </h2>
                  <p className="text-muted-2 mt-1 text-[13.5px] leading-[1.5]">
                    {formSections.student.subtitle}
                  </p>
                </div>
              </div>
              <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-4">
                <TextField
                  autoComplete="name"
                  error={errors.student?.fullName}
                  id="full-name"
                  label="Full name"
                  onValueChange={(value) =>
                    onStudentChange({ fullName: value })
                  }
                  placeholder="As in school records"
                  required
                  value={student.fullName}
                />
                <TextField
                  error={errors.student?.school}
                  id="school"
                  label="School"
                  onValueChange={(value) => onStudentChange({ school: value })}
                  placeholder="School name"
                  required
                  value={student.school}
                />
                <TextField
                  error={errors.student?.admissionNumber}
                  id="admission-number"
                  inputMode="numeric"
                  label="Admission number"
                  onValueChange={(value) =>
                    onStudentChange({ admissionNumber: value })
                  }
                  placeholder="e.g. 12345"
                  required
                  value={student.admissionNumber}
                />
                <SelectField
                  error={errors.student?.grade}
                  id="grade"
                  label="Grade"
                  onValueChange={(value) => onStudentChange({ grade: value })}
                  options={gradeOptions}
                  placeholder="Select grade"
                  required
                  value={student.grade}
                />
                <TextField
                  error={errors.student?.className}
                  id="class"
                  label="Class"
                  onValueChange={(value) =>
                    onStudentChange({ className: value })
                  }
                  placeholder="e.g. 10B"
                  required
                  value={student.className}
                />
                <TextField
                  autoComplete="tel"
                  error={errors.student?.contactNumber}
                  id="contact-number"
                  inputMode="tel"
                  label="Contact number"
                  onValueChange={(value) =>
                    onStudentChange({ contactNumber: value })
                  }
                  placeholder="07XXXXXXXX"
                  required
                  type="tel"
                  value={student.contactNumber}
                />
                <TextField
                  autoComplete="email"
                  error={errors.student?.email}
                  id="email"
                  inputMode="email"
                  label="Email"
                  onValueChange={(value) => onStudentChange({ email: value })}
                  placeholder="you@example.com"
                  type="email"
                  value={student.email}
                />
              </div>
            </Card>

            <Card className={cardClasses}>
              <div className="mb-[22px] flex items-start gap-3.5">
                <span className={chipClasses}>
                  {formSections.guardian.step}
                </span>
                <div>
                  <h2 className="font-display text-fg text-[21px] font-semibold tracking-[-0.02em]">
                    {formSections.guardian.title}
                  </h2>
                  <p className="text-muted-2 mt-1 text-[13.5px] leading-[1.5]">
                    {formSections.guardian.subtitle}
                  </p>
                </div>
              </div>
              <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-4">
                <TextField
                  autoComplete="name"
                  error={errors.guardian?.name}
                  id="guardian-name"
                  label="Parent / guardian name"
                  onValueChange={(value) => onGuardianChange({ name: value })}
                  placeholder="Full name"
                  required
                  value={guardian.name}
                />
                <SelectField
                  error={errors.guardian?.relationship}
                  id="guardian-relationship"
                  label="Relationship"
                  onValueChange={(value) =>
                    onGuardianChange({ relationship: value })
                  }
                  options={relationshipOptions}
                  placeholder="Select relationship"
                  required
                  value={guardian.relationship}
                />
                <TextField
                  autoComplete="tel"
                  error={errors.guardian?.contactNumber}
                  id="guardian-contact"
                  inputMode="tel"
                  label="Parent / guardian contact number"
                  onValueChange={(value) =>
                    onGuardianChange({ contactNumber: value })
                  }
                  required
                  type="tel"
                  value={guardian.contactNumber}
                />
                <TextField
                  autoComplete="tel"
                  error={errors.guardian?.alternateContactNumber}
                  id="alternate-contact"
                  inputMode="tel"
                  label="Alternate contact number"
                  onValueChange={(value) =>
                    onGuardianChange({ alternateContactNumber: value })
                  }
                  type="tel"
                  value={guardian.alternateContactNumber}
                />
              </div>
            </Card>

            <Card className={cardClasses}>
              <div className="mb-[22px] flex items-start gap-3.5">
                <span className={chipClasses}>{formSections.photo.step}</span>
                <div>
                  <h2 className="font-display text-fg text-[21px] font-semibold tracking-[-0.02em]">
                    {formSections.photo.title}
                  </h2>
                  <p className="text-muted-2 mt-1 text-[13.5px] leading-[1.5]">
                    {formSections.photo.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-4">
                <div
                  className="border-line-fg/20 flex h-[150px] w-[120px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-dashed"
                  style={{
                    background:
                      "repeating-linear-gradient(135deg,#061c16 0 8px,#04140f 8px 16px)",
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

                <div className="grid gap-2">
                  <Button
                    className="cursor-pointer"
                    render={
                      <label
                        aria-label={
                          photo
                            ? validationCopy.fileLabelChanged
                            : validationCopy.fileLabelSelected
                        }
                        htmlFor="volunteer-photo"
                      />
                    }
                    variant="outline"
                  >
                    <input
                      accept="image/jpeg,image/png"
                      className="sr-only"
                      id="volunteer-photo"
                      onChange={(event) =>
                        onPhotoChange(event.currentTarget.files?.[0] ?? null)
                      }
                      type="file"
                    />
                    {photo
                      ? validationCopy.fileLabelChanged
                      : validationCopy.fileLabelSelected}
                  </Button>
                  <span className="text-muted-2 text-[12.5px]">
                    {photo?.name ?? validationCopy.fileLabelEmpty}
                  </span>
                </div>
              </div>

              {errors.photo ? (
                <p className="text-gold-bright mt-3 text-[13px]">
                  {errors.photo}
                </p>
              ) : null}
            </Card>
          </div>

          <aside className="flex-[1_1_300px] lg:sticky lg:top-[100px]">
            <Card className="flex w-full flex-col gap-5 rounded-[20px] p-[clamp(20px,3vw,28px)]">
              <Kicker tone="volt">{applicationAside.kicker}</Kicker>

              <Checklist items={checklist} />

              <ProgressMeter
                label={applicationAside.progressLabel}
                max={5}
                value={completedSteps + (consent ? 1 : 0)}
              />

              <CheckboxField
                checked={consent}
                error={errors.consent}
                id="consent"
                label={consentCopy}
                onCheckedChange={onConsentChange}
              />

              <Button className="w-full" type="submit">
                {applicationAside.submitLabel}
              </Button>

              <p className="text-faint text-[12px] leading-[1.55]">
                {applicationAside.privacyNote}
              </p>
            </Card>
          </aside>
        </form>
      </Container>
    </Section>
  );
};
