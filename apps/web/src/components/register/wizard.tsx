import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { SubpageHero } from "@/components/site/subpage-hero";
import { orpc } from "@/utils/orpc";

import type {
  Division,
  MemberDetails,
  RegisterErrors,
  RegisterState,
  SchoolDetails,
  SchoolErrors,
  StepKey,
  StudentErrors,
  TeacherDetails,
  TeacherErrors,
  TeamDetails,
  TeamErrors,
} from "./data";
import {
  createEmptyMember,
  divisionGrades,
  initialRegisterState,
  registerAside,
  registerHero,
  registerSteps,
  stepOrder,
  validationCopy,
} from "./data";
import { RegisterStepper } from "./register-stepper";
import { StepConfirmation } from "./step-confirmation";
import { StepDivision } from "./step-division";
import { StepReview } from "./step-review";
import { StepSchool } from "./step-school";
import { StepStudents } from "./step-students";
import { StepTeacher } from "./step-teacher";
import { StepTeam } from "./step-team";

const PHONE_PATTERN = /^(?:\+94|0)\d{9}$/u;
const EMAIL_PATTERN = /^[^@\s@]+@[^\s@]+\.[^@\s@]+$/u;
const REFERENCE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const isPhone = (value: string) =>
  PHONE_PATTERN.test(value.replaceAll(/[\s-]/gu, ""));

const isGradeAllowed = (division: Division | null, grade: string) =>
  division !== null && divisionGrades[division].includes(grade);

/** The API names the divisions differently to the wizard. */
const divisionToApi = (division: Division) =>
  division === "junior" ? "primary" : "secondary";

const messageFor = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

const createReference = () => {
  const year = String(new Date().getFullYear()).slice(-2);
  const number = 1000 + Math.floor(Math.random() * 9000);
  const suffix = Array.from(
    { length: 4 },
    () =>
      REFERENCE_ALPHABET[Math.floor(Math.random() * REFERENCE_ALPHABET.length)]
  ).join("");

  return `BQ${year}-T${number}-${suffix}`;
};

const validateSchool = (school: SchoolDetails): SchoolErrors => {
  const errors: SchoolErrors = {};

  if (school.name.trim().length === 0) {
    errors.name = validationCopy.required;
  }
  if (school.province === null) {
    errors.province = validationCopy.required;
  }
  if (school.district.trim().length === 0) {
    errors.district = validationCopy.required;
  }

  return errors;
};

const validateTeam = (team: TeamDetails): TeamErrors => {
  const errors: TeamErrors = {};

  if (team.name.trim().length === 0) {
    errors.name = validationCopy.required;
  }

  return errors;
};

const validateStudents = (
  students: MemberDetails[],
  division: Division | null
): Record<string, StudentErrors> => {
  const errors: Record<string, StudentErrors> = {};

  for (const [index, member] of students.entries()) {
    const entry: StudentErrors = {};

    if (member.fullName.trim().length === 0) {
      entry.fullName = validationCopy.required;
    }
    if (member.className.trim().length === 0) {
      entry.className = validationCopy.required;
    }
    if (member.admissionNumber.trim().length === 0) {
      entry.admissionNumber = validationCopy.required;
    }
    if (member.grade === null) {
      entry.grade = validationCopy.required;
    } else if (!isGradeAllowed(division, member.grade)) {
      entry.grade = validationCopy.divisionGrade;
    }

    if (Object.keys(entry).length > 0) {
      errors[String(index)] = entry;
    }
  }

  return errors;
};

const validateTeacher = (teacher: TeacherDetails): TeacherErrors => {
  const errors: TeacherErrors = {};

  if (teacher.name.trim().length === 0) {
    errors.name = validationCopy.required;
  }
  if (teacher.designation.trim().length === 0) {
    errors.designation = validationCopy.required;
  }
  if (teacher.phone.trim().length === 0) {
    errors.phone = validationCopy.required;
  } else if (!isPhone(teacher.phone)) {
    errors.phone = validationCopy.phone;
  }
  if (teacher.email.trim().length === 0) {
    errors.email = validationCopy.required;
  } else if (!EMAIL_PATTERN.test(teacher.email)) {
    errors.email = validationCopy.email;
  }

  return errors;
};

const validateStep = (step: number, state: RegisterState): RegisterErrors => {
  const errors: RegisterErrors = {};
  const key = stepOrder[step];

  if (key === "school") {
    const school = validateSchool(state.school);
    if (Object.keys(school).length > 0) {
      errors.school = school;
    }
  }

  if (key === "division" && state.division === null) {
    errors.division = validationCopy.division;
  }

  if (key === "team") {
    const team = validateTeam(state.team);
    if (Object.keys(team).length > 0) {
      errors.team = team;
    }
  }

  if (key === "students") {
    const students = validateStudents(state.students, state.division);
    if (Object.keys(students).length > 0) {
      errors.students = students;
    }
  }

  if (key === "teacher") {
    const teacher = validateTeacher(state.teacher);
    if (Object.keys(teacher).length > 0) {
      errors.teacher = teacher;
    }
  }

  if (key === "review" && !state.consent) {
    errors.consent = validationCopy.consent;
  }

  return errors;
};

export const Register = () => {
  const [state, setState] = useState<RegisterState>(initialRegisterState);
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [reference, setReference] = useState("");
  const [pending, setPending] = useState(false);

  const currentKey = stepOrder[step];
  const content = registerSteps[currentKey];
  const isConfirmation = currentKey === "confirmation";
  const reviewStep = stepOrder.indexOf("review");

  const handleSchoolChange = (patch: Partial<SchoolDetails>) => {
    setState((current) => ({
      ...current,
      school: { ...current.school, ...patch },
    }));
    setErrors((current) => ({ ...current, school: undefined }));
  };

  const handleDivisionChange = (division: Division) => {
    setState((current) => ({ ...current, division }));
    setErrors((current) => ({ ...current, division: undefined }));
  };

  const handleTeamChange = (patch: Partial<TeamDetails>) => {
    setState((current) => ({
      ...current,
      team: { ...current.team, ...patch },
    }));
    setErrors((current) => ({ ...current, team: undefined }));
  };

  const handleSizeChange = (size: string) => {
    const count = Number(size);
    setState((current) => ({
      ...current,
      team: { ...current.team, size },
      students: Array.from(
        { length: count },
        (_, index) => current.students[index] ?? createEmptyMember()
      ),
      leaderIndex: Math.min(current.leaderIndex, count - 1),
    }));
    setErrors((current) => ({ ...current, team: undefined }));
  };

  const handleMemberChange = (index: number, patch: Partial<MemberDetails>) => {
    setState((current) => ({
      ...current,
      students: current.students.map((member, at) =>
        at === index ? { ...member, ...patch } : member
      ),
    }));
    setErrors((current) => ({ ...current, students: undefined }));
  };

  const handleLeaderChange = (index: number) => {
    setState((current) => ({ ...current, leaderIndex: index }));
  };

  const handleTeacherChange = (patch: Partial<TeacherDetails>) => {
    setState((current) => ({
      ...current,
      teacher: { ...current.teacher, ...patch },
    }));
    setErrors((current) => ({ ...current, teacher: undefined }));
  };

  const handleConsentChange = (checked: boolean) => {
    setState((current) => ({ ...current, consent: checked }));
    setErrors((current) => ({ ...current, consent: undefined }));
  };

  /**
   * Submit the full registration: school, team, every student on the
   * roster and the teacher/principal contact. No account is created --
   * the school's MIC or principal submits this directly.
   */
  const submitTeam = async (): Promise<boolean> => {
    if (state.division === null) {
      return false;
    }

    setPending(true);
    try {
      await orpc.teams.register.call({
        teamName: state.team.name.trim(),
        division: divisionToApi(state.division),
        idea: state.team.idea.trim() || undefined,
        school: {
          name: state.school.name.trim(),
          province: state.school.province ?? "",
          city: state.school.district.trim(),
          address: state.school.address.trim() || undefined,
        },
        members: state.students.map((member) => ({
          fullName: member.fullName.trim(),
          grade: member.grade ?? "",
          className: member.className.trim(),
          admissionNumber: member.admissionNumber.trim(),
        })),
        leaderIndex: state.leaderIndex,
        teacher: {
          name: state.teacher.name.trim(),
          designation: state.teacher.designation.trim(),
          phone: state.teacher.phone.trim(),
          email: state.teacher.email.trim(),
        },
        principal: state.teacher.principal.trim() || undefined,
      });
    } catch (error) {
      setPending(false);
      setErrors({
        team: { name: messageFor(error, "We could not register that team") },
      });
      toast.error(messageFor(error, "We could not register that team"));
      return false;
    }
    setPending(false);
    return true;
  };

  const handleNext = async () => {
    const nextErrors = validateStep(step, state);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error(validationCopy.incomplete);
      return;
    }

    if (currentKey === "review") {
      const ok = await submitTeam();
      if (!ok) {
        return;
      }
    }

    const nextStep = Math.min(step + 1, stepOrder.length - 1);
    const nextKey = stepOrder[nextStep];

    setErrors({});
    setStep(nextStep);
    setMaxStep((current) => Math.max(current, nextStep));

    if (nextKey === "confirmation") {
      setReference(createReference());
      setSubmitted(true);
      toast.success("Registration received");
    }

    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const goToStep = (target: number) => {
    setErrors({});
    setStep(target);
    if (stepOrder[target] !== "confirmation") {
      setSubmitted(false);
    }
  };

  const handleBack = () => {
    goToStep(Math.max(step - 1, 0));
  };

  const handleSelect = (index: number) => {
    if (index > maxStep) {
      return;
    }
    goToStep(index);
  };

  const handleReset = () => {
    setState(initialRegisterState);
    setStep(0);
    setMaxStep(0);
    setSubmitted(false);
    setErrors({});
    setReference("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const advanceLabel = (() => {
    if (step === reviewStep) {
      return registerAside.submitLabel;
    }
    return registerAside.continueLabel;
  })();

  const panels: Record<StepKey, ReactNode> = {
    school: (
      <StepSchool
        errors={errors}
        onChange={handleSchoolChange}
        school={state.school}
      />
    ),
    division: (
      <StepDivision
        division={state.division}
        errors={errors}
        onChange={handleDivisionChange}
      />
    ),
    team: (
      <StepTeam
        errors={errors}
        onChange={handleTeamChange}
        onSizeChange={handleSizeChange}
        team={state.team}
      />
    ),
    students: (
      <StepStudents
        division={state.division}
        errors={errors}
        leaderIndex={state.leaderIndex}
        onLeaderChange={handleLeaderChange}
        onMemberChange={handleMemberChange}
        students={state.students}
      />
    ),
    teacher: (
      <StepTeacher
        errors={errors}
        onChange={handleTeacherChange}
        teacher={state.teacher}
      />
    ),
    review: (
      <StepReview
        errors={errors}
        onConsentChange={handleConsentChange}
        onEdit={(key) => handleSelect(stepOrder.indexOf(key))}
        state={state}
      />
    ),
    confirmation: (
      <StepConfirmation
        onReset={handleReset}
        reference={reference}
        state={state}
      />
    ),
  };

  return (
    <main className="bg-ink overflow-x-hidden">
      <SubpageHero
        aside={
          <div className="flex flex-wrap gap-2">
            {registerHero.pills.map((pill) => (
              <span
                className="rounded-full px-3 py-2 text-[13px] whitespace-nowrap"
                key={pill.label}
                style={{
                  color: pill.color,
                  border: `1px solid ${pill.line}`,
                }}
              >
                {pill.label}
              </span>
            ))}
          </div>
        }
        className="pt-[clamp(48px,6vw,80px)] pb-[clamp(28px,4vw,44px)] [&_h1]:mt-4 [&_h1]:text-[clamp(40px,5.5vw,76px)]"
        gridClassName="mt-6 gap-y-5"
        kicker={registerHero.kicker}
        title={registerHero.title}
      />

      <section
        className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,112px)]"
        id="register"
      >
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-start gap-5">
          <RegisterStepper
            current={step}
            done={submitted}
            maxStep={maxStep}
            onSelect={handleSelect}
          />

          <div className="bg-surface min-w-0 flex-[3_1_560px] rounded-[24px] border border-[rgba(185,245,208,0.09)] p-[clamp(22px,3.5vw,40px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            {isConfirmation ? null : (
              <div className="mb-6">
                <div className="text-volt font-mono text-[10.5px] tracking-[0.16em]">
                  {content.eyebrow}
                </div>
                <h2 className="mt-2 mb-0 text-[clamp(26px,3vw,36px)] leading-[1.05] tracking-[-0.03em]">
                  {content.title}
                </h2>
                <p className="text-muted-2 mt-2 mb-0 max-w-[560px] text-[14.5px] leading-[1.55]">
                  {content.body}
                </p>
              </div>
            )}

            {panels[currentKey]}

            {submitted ? null : (
              <div className="mt-7 flex items-center justify-between gap-3 border-t border-[rgba(185,245,208,0.08)] pt-5">
                <button
                  className="cursor-pointer rounded-full border border-[rgba(242,247,244,0.2)] bg-transparent px-5 py-[13px] font-sans text-[14px] font-semibold disabled:cursor-default"
                  disabled={pending || step === 0}
                  onClick={handleBack}
                  style={{ color: step === 0 ? "#3D5249" : "#F2F7F4" }}
                  type="button"
                >
                  {registerAside.backLabel}
                </button>
                <button
                  aria-busy={pending}
                  className="bg-volt text-ink hover:bg-lime cursor-pointer rounded-full border-none px-6 py-3.5 font-sans text-[14.5px] font-bold whitespace-nowrap disabled:opacity-60"
                  disabled={pending}
                  onClick={handleNext}
                  type="button"
                >
                  {advanceLabel}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
