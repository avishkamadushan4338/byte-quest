import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ArrowLabel } from "@/components/site/arrow-label";
import { SubpageHero } from "@/components/site/subpage-hero";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from "@/components/site/contact";
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
  RulesLanguage,
  TeacherErrors,
  TeamDetails,
  TeamErrors,
} from "./data";
import {
  createEmptyMember,
  allowedGradesForMember,
  divisionOrder,
  REGISTRATION_OPENS_AT,
  LEADER_INDEX,
  initialRegisterState,
  registerAside,
  registerHero,
  registerSteps,
  stepOrder,
  validationCopy,
} from "./data";
import { RegistrationNotOpen } from "./not-open";
import { RegisterStepper } from "./register-stepper";
import { StepConfirmation } from "./step-confirmation";
import { StepDivision } from "./step-division";
import { StepReview } from "./step-review";
import { StepRules } from "./step-rules";
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

  const leaderEmail = team.leaderEmail.trim();
  if (leaderEmail.length === 0) {
    errors.leaderEmail = validationCopy.required;
  } else if (!EMAIL_PATTERN.test(leaderEmail)) {
    errors.leaderEmail = validationCopy.email;
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
    if (member.birthday.trim().length === 0) {
      entry.birthday = validationCopy.required;
    }
    if (member.whatsapp.trim().length === 0) {
      entry.whatsapp = validationCopy.required;
    } else if (!isPhone(member.whatsapp)) {
      entry.whatsapp = validationCopy.phone;
    }
    if (member.grade === null) {
      entry.grade = validationCopy.required;
    } else if (
      !allowedGradesForMember(division, member.minorAgeCategory).includes(
        member.grade
      )
    ) {
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
  if (teacher.phone.trim().length === 0) {
    errors.phone = validationCopy.required;
  } else if (!isPhone(teacher.phone)) {
    errors.phone = validationCopy.phone;
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

const CONFIRMATION_STEP = stepOrder.indexOf("confirmation");

const draftToState = (draft: RegisterDraft | null) => {
  const submitted = draft?.submitted ?? false;
  return {
    state: draft?.state ?? initialRegisterState,
    step: submitted ? CONFIRMATION_STEP : (draft?.step ?? 0),
    maxStep: submitted ? CONFIRMATION_STEP : (draft?.maxStep ?? 0),
    submitted,
    references: draft?.references ?? {},
  };
};

export const Register = () => {
  const initial = draftToState(null);
  const [state, setState] = useState<RegisterState>(initial.state);
  const [step, setStep] = useState(initial.step);
  const [maxStep, setMaxStep] = useState(initial.maxStep);
  const [submitted, setSubmitted] = useState(initial.submitted);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [references, setReferences] = useState<
    Partial<Record<Division, string>>
  >(initial.references);
  const [pending, setPending] = useState(false);
  const [rulesLanguage, setRulesLanguage] = useState<RulesLanguage>("en");
  const [isOpen, setIsOpen] = useState(
    () => Date.now() >= REGISTRATION_OPENS_AT.getTime()
  );
  const handleOpen = useCallback(() => setIsOpen(true), []);
  const [isClosed, setIsClosed] = useState(
    () => Date.now() > REGISTRATION_CLOSES_AT.getTime()
  );

  // Restore the saved draft after mount, not in the first render: reading
  // localStorage during render makes the client disagree with the server HTML,
  // and React then leaves the inputs empty instead of showing the draft.
  useEffect(() => {
    const restored = draftToState(loadDraft());
    setState(restored.state);
    setStep(restored.step);
    setMaxStep(restored.maxStep);
    setSubmitted(restored.submitted);
    setReferences(restored.references);
  }, []);

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

  const persist = (patch: Partial<RegisterDraft>) => {
    const draft: RegisterDraft = {
      state,
      step,
      maxStep,
      submitted,
      references,
      ...patch,
    };
    saveDraft(draft);
  };

  const currentKey = stepOrder[step];
  const content = registerSteps[currentKey];
  const isConfirmation = currentKey === "confirmation";
  const reviewStep = stepOrder.indexOf("review");
  const activeDivisions = divisionOrder.filter((division) =>
    state.divisions.includes(division)
  );

  const handleSchoolChange = (patch: Partial<SchoolDetails>) => {
    setState((current) => {
      const next = { ...current, school: { ...current.school, ...patch } };
      persist({ state: next });
      return next;
    });
    setErrors((current) => ({ ...current, school: undefined }));
  };

  const handleDivisionSelect = (division: Division) => {
    setState((current) => {
      const next = { ...current, divisions: [division] };
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

  const handleApplyGradePreset = (division: Division) => {
    setState((current) => {
      const [source] = current.students[division];
      const next = {
        ...current,
        students: {
          ...current.students,
          [division]: current.students[division].map((member, index) =>
            index === 0
              ? member
              : {
                  ...member,
                  grade: source.grade,
                }
          ),
        },
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
   * Submit every selected division. The registration is final: no edit path
   * exists, so the submitted state is locked once this succeeds.
   */
  const submitAll = async (): Promise<typeof references | null> => {
    setPending(true);
    const nextReferences: Partial<Record<Division, string>> = { ...references };

    const outcomes = await Promise.allSettled(
      activeDivisions.map(async (division) => {
        const payload = {
          division: divisionToApi(division),
          school: {
            name: state.school.name.trim(),
            province: state.school.province ?? "",
            city: state.school.district.trim(),
            address: state.school.address.trim() || undefined,
          },
          members: state.students[division].map((member) => ({
            fullName: member.fullName.trim(),
            grade: member.grade ?? "",
            minorAgeCategory: member.minorAgeCategory,
            birthday: member.birthday.trim(),
            whatsapp: member.whatsapp.trim(),
            address: member.address.trim(),
            guardianName: member.guardianName.trim(),
            guardianPhone: member.guardianPhone.trim(),
          })),
          leaderIndex: LEADER_INDEX,
          leaderEmail: state.teams[division].leaderEmail.trim(),
          presenterIndex: LEADER_INDEX,
          teacher: {
            name: state.teacher.name.trim(),
            phone: state.teacher.phone.trim(),
          },
        };

        const result = await orpc.teams.register.call(payload);
        return { division, referenceCode: result.referenceCode };
      })
    );

    for (const [index, outcome] of outcomes.entries()) {
      const division = activeDivisions[index];
      if (!division) {
        continue;
      }
      if (outcome.status === "fulfilled") {
        if (outcome.value.referenceCode) {
          nextReferences[division] = outcome.value.referenceCode;
        }
      } else {
        toast.error(
          messageFor(outcome.reason, "We could not register that team")
        );
      }
    }

    setReferences(nextReferences);
    persist({ references: nextReferences });
    setPending(false);

    if (outcomes.some((outcome) => outcome.status === "rejected")) {
      return null;
    }

    return nextReferences;
  };

  const handleNext = async () => {
    const nextErrors = validateStep(step, state);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error(validationCopy.incomplete);
      return;
    }

    let nextReferences = references;
    if (currentKey === "review") {
      const submittedReferences = await submitAll();
      if (!submittedReferences) {
        return;
      }
      nextReferences = submittedReferences;
    }

    const nextStep = Math.min(step + 1, stepOrder.length - 1);
    const nextKey = stepOrder[nextStep];
    const nextSubmitted = nextKey === "confirmation";

    setErrors({});
    setStep(nextStep);
    setMaxStep((current) => Math.max(current, nextStep));
    setSubmitted(nextSubmitted);
    persist({
      step: nextStep,
      maxStep: Math.max(maxStep, nextStep),
      submitted: nextSubmitted,
      references: nextReferences,
    });

    if (nextSubmitted) {
      toast.success("Registration received");
    }

    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const goToStep = (target: number) => {
    setErrors({});
    setStep(target);
    persist({ step: target });
  };

  const handleBack = () => {
    goToStep(Math.max(step - 1, 0));
  };

  const handleSelect = (index: number) => {
    if (submitted || index > maxStep) {
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
    clearDraft();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const advanceLabel = (() => {
    if (step === reviewStep) {
      return registerAside.submitLabel;
    }
    return registerAside.continueLabel;
  })();

  const panels: Record<StepKey, ReactNode> = {
    rules: (
      <StepRules language={rulesLanguage} onLanguageChange={setRulesLanguage} />
    ),
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
        onSelect={handleDivisionSelect}
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
        onMemberChange={handleMemberChange}
        onApplyGradePreset={handleApplyGradePreset}
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

  if (!isOpen && !submitted) {
    return <RegistrationNotOpen onOpen={handleOpen} />;
  }

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
            <p className="text-muted mt-4 mb-0 text-[15px] leading-[1.65]">
              Backup contact:{" "}
              <a
                className="text-volt hover:text-lime font-mono"
                href={CONTACT_PHONE_HREF}
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
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
                className="rounded-full px-3 py-2 text-[14.5px] whitespace-nowrap"
                key={pill.label}
                style={{
                  color: pill.color,
                  border: `1px solid ${pill.line}`,
                }}
              >
                {pill.label}
              </span>
            ))}
            <Link
              className="text-fg hover:border-volt hover:text-volt rounded-full border border-[rgba(185,245,208,0.18)] px-3 py-2 font-mono text-[14.5px] whitespace-nowrap transition-colors duration-200"
              to="/"
            >
              ← Back to home
            </Link>
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
              <div className="mb-6 rounded-[14px] border border-[rgba(240,216,117,0.3)] bg-[rgba(240,216,117,0.08)] px-4 py-3 text-[14.5px] text-[#F0D875]">
                Registration closed on 10 January 2027 - this submission is now
                read-only.
              </div>
            ) : null}
            {isConfirmation ? null : (
              <div className="mb-6">
                <div className="text-volt font-mono text-[12.5px] tracking-[0.16em]">
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

            <div className="text-muted-2 mt-6 text-[14px] leading-[1.55]">
              Need help? Contact the organising committee:{" "}
              <a
                className="text-volt hover:text-lime font-mono"
                href={CONTACT_PHONE_HREF}
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>

            {submitted || isClosed ? null : (
              <div className="mt-7 flex items-center justify-between gap-3 border-t border-[rgba(185,245,208,0.08)] pt-5">
                <button
                  className="cursor-pointer rounded-full border border-[rgba(242,247,244,0.2)] bg-transparent px-5 py-[13px] font-sans text-[15.5px] font-semibold disabled:cursor-default"
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
