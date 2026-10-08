import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ArrowLabel } from "@/components/site/arrow-label";
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
  divisionOrder,
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
import type { RegisterDraft } from "./storage";
import { clearDraft, loadDraft, saveDraft } from "./storage";

const PHONE_PATTERN = /^(?:\+94|0)\d{9}$/u;
const EMAIL_PATTERN = /^[^@\s@]+@[^\s@]+\.[^@\s@]+$/u;

/** Registrations (new or edited) are no longer accepted after this date. */
const REGISTRATION_CLOSES_AT = new Date("2027-01-10T23:59:59+05:30");

const isPhone = (value: string) =>
  PHONE_PATTERN.test(value.replaceAll(/[\s-]/gu, ""));

const isGradeAllowed = (division: Division, grade: string) =>
  divisionGrades[division].includes(grade);

/** The API names the divisions differently to the wizard. */
const divisionToApi = (division: Division): "primary" | "secondary" =>
  division === "junior" ? "primary" : "secondary";

const messageFor = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

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
  division: Division
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
  const activeDivisions = divisionOrder.filter((division) =>
    state.divisions.includes(division)
  );

  if (key === "school") {
    const school = validateSchool(state.school);
    if (Object.keys(school).length > 0) {
      errors.school = school;
    }
  }

  if (key === "division" && state.divisions.length === 0) {
    errors.divisions = validationCopy.division;
  }

  if (key === "team") {
    const teamErrors: Partial<Record<Division, TeamErrors>> = {};
    for (const division of activeDivisions) {
      const result = validateTeam(state.teams[division]);
      if (Object.keys(result).length > 0) {
        teamErrors[division] = result;
      }
    }
    if (Object.keys(teamErrors).length > 0) {
      errors.teams = teamErrors;
    }
  }

  if (key === "students") {
    const studentErrors: Partial<
      Record<Division, Record<string, StudentErrors>>
    > = {};
    for (const division of activeDivisions) {
      const result = validateStudents(state.students[division], division);
      if (Object.keys(result).length > 0) {
        studentErrors[division] = result;
      }
    }
    if (Object.keys(studentErrors).length > 0) {
      errors.students = studentErrors;
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

const draftToState = (draft: RegisterDraft | null) => ({
  state: draft?.state ?? initialRegisterState,
  step: draft?.step ?? 0,
  maxStep: draft?.maxStep ?? 0,
  submitted: draft?.submitted ?? false,
  references: draft?.references ?? {},
  editTokens: draft?.editTokens ?? {},
});

export const Register = () => {
  const initial = draftToState(loadDraft());
  const [state, setState] = useState<RegisterState>(initial.state);
  const [step, setStep] = useState(initial.step);
  const [maxStep, setMaxStep] = useState(initial.maxStep);
  const [submitted, setSubmitted] = useState(initial.submitted);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [references, setReferences] = useState<
    Partial<Record<Division, string>>
  >(initial.references);
  const [editTokens, setEditTokens] = useState<
    Partial<Record<Division, string>>
  >(initial.editTokens);
  const [pending, setPending] = useState(false);
  const [isClosed, setIsClosed] = useState(
    () => Date.now() > REGISTRATION_CLOSES_AT.getTime()
  );

  useEffect(() => {
    if (isClosed) {
      return;
    }
    const timer = window.setInterval(() => {
      if (Date.now() > REGISTRATION_CLOSES_AT.getTime()) {
        setIsClosed(true);
      }
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [isClosed]);

  const isEditing = Object.values(editTokens).some(Boolean);

  const persist = (patch: Partial<RegisterDraft>) => {
    const draft: RegisterDraft = {
      state,
      step,
      maxStep,
      submitted,
      references,
      editTokens,
      ...patch,
    };
    saveDraft(draft);
  };

  const currentKey = stepOrder[step];
  const content = registerSteps[currentKey];
  const isConfirmation = currentKey === "confirmation";
  const reviewStep = stepOrder.indexOf("review");

  const handleSchoolChange = (patch: Partial<SchoolDetails>) => {
    setState((current) => {
      const next = { ...current, school: { ...current.school, ...patch } };
      persist({ state: next });
      return next;
    });
    setErrors((current) => ({ ...current, school: undefined }));
  };

  const handleDivisionToggle = (division: Division) => {
    setState((current) => {
      const divisions = current.divisions.includes(division)
        ? current.divisions.filter((d) => d !== division)
        : [...current.divisions, division];
      const next = { ...current, divisions };
      persist({ state: next });
      return next;
    });
    setErrors((current) => ({ ...current, divisions: undefined }));
  };

  const handleTeamChange = (
    division: Division,
    patch: Partial<TeamDetails>
  ) => {
    setState((current) => {
      const next = {
        ...current,
        teams: {
          ...current.teams,
          [division]: { ...current.teams[division], ...patch },
        },
      };
      persist({ state: next });
      return next;
    });
    setErrors((current) => ({
      ...current,
      teams: { ...current.teams, [division]: undefined },
    }));
  };

  const handleSizeChange = (division: Division, size: string) => {
    const count = Number(size);
    setState((current) => {
      const next = {
        ...current,
        teams: {
          ...current.teams,
          [division]: { ...current.teams[division], size },
        },
        students: {
          ...current.students,
          [division]: Array.from(
            { length: count },
            (_, index) =>
              current.students[division][index] ?? createEmptyMember()
          ),
        },
        leaderIndex: {
          ...current.leaderIndex,
          [division]: Math.min(current.leaderIndex[division], count - 1),
        },
      };
      persist({ state: next });
      return next;
    });
  };

  const handleMemberChange = (
    division: Division,
    index: number,
    patch: Partial<MemberDetails>
  ) => {
    setState((current) => {
      const next = {
        ...current,
        students: {
          ...current.students,
          [division]: current.students[division].map((member, at) =>
            at === index ? { ...member, ...patch } : member
          ),
        },
      };
      persist({ state: next });
      return next;
    });
    setErrors((current) => ({
      ...current,
      students: { ...current.students, [division]: undefined },
    }));
  };

  const handleLeaderChange = (division: Division, index: number) => {
    setState((current) => {
      const next = {
        ...current,
        leaderIndex: { ...current.leaderIndex, [division]: index },
      };
      persist({ state: next });
      return next;
    });
  };

  const handleTeacherChange = (patch: Partial<TeacherDetails>) => {
    setState((current) => {
      const next = { ...current, teacher: { ...current.teacher, ...patch } };
      persist({ state: next });
      return next;
    });
    setErrors((current) => ({ ...current, teacher: undefined }));
  };

  const handleConsentChange = (checked: boolean) => {
    setState((current) => {
      const next = { ...current, consent: checked };
      persist({ state: next });
      return next;
    });
    setErrors((current) => ({ ...current, consent: undefined }));
  };

  /**
   * Submit (or resubmit) every selected division. No account is created -
   * the school's MIC or principal submits this directly, and the edit
   * token returned for each division lets them revise it later from this
   * same browser, up to the closing date.
   */
  const submitAll = async (): Promise<boolean> => {
    const activeDivisions = divisionOrder.filter((division) =>
      state.divisions.includes(division)
    );

    setPending(true);
    const nextReferences: Partial<Record<Division, string>> = { ...references };
    const nextEditTokens: Partial<Record<Division, string>> = { ...editTokens };
    const teamErrors: Partial<Record<Division, TeamErrors>> = {};

    const outcomes = await Promise.allSettled(
      activeDivisions.map(async (division) => {
        const payload = {
          teamName: state.teams[division].name.trim(),
          division: divisionToApi(division),
          idea: state.teams[division].idea.trim() || undefined,
          school: {
            name: state.school.name.trim(),
            province: state.school.province ?? "",
            city: state.school.district.trim(),
            address: state.school.address.trim() || undefined,
          },
          members: state.students[division].map((member) => ({
            fullName: member.fullName.trim(),
            grade: member.grade ?? "",
            className: member.className.trim(),
            admissionNumber: member.admissionNumber.trim(),
          })),
          leaderIndex: state.leaderIndex[division],
          teacher: {
            name: state.teacher.name.trim(),
            designation: state.teacher.designation.trim(),
            phone: state.teacher.phone.trim(),
            email: state.teacher.email.trim(),
          },
          principal: state.teacher.principal.trim() || undefined,
        };

        const existingToken = editTokens[division];
        if (existingToken) {
          const result = await orpc.teams.update.call({
            ...payload,
            editToken: existingToken,
          });
          return { division, id: result.id, editToken: existingToken };
        }
        const result = await orpc.teams.register.call(payload);
        return { division, id: result.id, editToken: result.editToken };
      })
    );

    for (const [index, outcome] of outcomes.entries()) {
      const division = activeDivisions[index];
      if (!division) {
        continue;
      }
      if (outcome.status === "fulfilled") {
        nextReferences[division] = outcome.value.id;
        nextEditTokens[division] = outcome.value.editToken;
      } else {
        teamErrors[division] = {
          name: messageFor(outcome.reason, "We could not register that team"),
        };
        toast.error(
          messageFor(outcome.reason, "We could not register that team")
        );
      }
    }

    setReferences(nextReferences);
    setEditTokens(nextEditTokens);
    persist({ references: nextReferences, editTokens: nextEditTokens });
    setPending(false);

    if (Object.keys(teamErrors).length > 0) {
      setErrors({ teams: teamErrors });
      return false;
    }

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
      const ok = await submitAll();
      if (!ok) {
        return;
      }
    }

    const nextStep = Math.min(step + 1, stepOrder.length - 1);
    const nextKey = stepOrder[nextStep];

    setErrors({});
    setStep(nextStep);
    setMaxStep((current) => Math.max(current, nextStep));
    persist({ step: nextStep, maxStep: Math.max(maxStep, nextStep) });

    if (nextKey === "confirmation") {
      setSubmitted(true);
      persist({ submitted: true });
      toast.success(
        isEditing ? "Registration updated" : "Registration received"
      );
    }

    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const goToStep = (target: number) => {
    setErrors({});
    setStep(target);
    const leavingConfirmation = stepOrder[target] !== "confirmation";
    if (leavingConfirmation) {
      setSubmitted(false);
    }
    persist({ step: target, submitted: !leavingConfirmation && submitted });
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
    setReferences({});
    setEditTokens({});
    clearDraft();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const advanceLabel = (() => {
    if (step === reviewStep) {
      return isEditing ? "Save changes →" : registerAside.submitLabel;
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
        divisions={state.divisions}
        errors={errors}
        onToggle={handleDivisionToggle}
      />
    ),
    team: (
      <StepTeam
        divisions={state.divisions}
        errors={errors}
        onChange={handleTeamChange}
        onSizeChange={handleSizeChange}
        teams={state.teams}
      />
    ),
    students: (
      <StepStudents
        divisions={state.divisions}
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
        references={references}
        state={state}
      />
    ),
  };

  if (isClosed && !submitted) {
    return (
      <main className="bg-ink">
        <SubpageHero
          className="pt-[clamp(48px,6vw,80px)] pb-[clamp(28px,4vw,44px)] [&_h1]:mt-4 [&_h1]:text-[clamp(40px,5.5vw,76px)]"
          kicker={registerHero.kicker}
          title="Registration is closed."
        />
        <section className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,112px)]">
          <div className="bg-surface mx-auto max-w-[640px] rounded-[24px] border border-[rgba(185,245,208,0.09)] p-[clamp(22px,3.5vw,40px)] text-center">
            <p className="text-muted m-0 text-[15px] leading-[1.65]">
              BYTE QUEST registration closed on 10 January 2027. If your school
              still needs to field a team, contact the organising committee
              directly.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-ink">
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
            {isClosed ? (
              <div className="mb-6 rounded-[14px] border border-[rgba(240,216,117,0.3)] bg-[rgba(240,216,117,0.08)] px-4 py-3 text-[13px] text-[#F0D875]">
                Registration closed on 10 January 2027 - this submission is now
                read-only.
              </div>
            ) : null}
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

            {submitted || isClosed ? null : (
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
                  <ArrowLabel>{advanceLabel}</ArrowLabel>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
