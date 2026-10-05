import { Badge } from "@byte-quest/ui/components/badge";
import { Card } from "@byte-quest/ui/components/card";
import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { ProgressMeter, Steps } from "@byte-quest/ui/components/steps";
import { Button } from "@byte-quest/ui/primitives/button";
import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHero } from "@/components/site/page-hero";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

import type {
  AccountDetails,
  AccountErrors,
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
  stepList,
  stepOrder,
  validationCopy,
} from "./data";
import { StepAccount } from "./step-account";
import { StepConfirmation } from "./step-confirmation";
import { StepDivision } from "./step-division";
import { StepReview } from "./step-review";
import { StepSchool } from "./step-school";
import { StepStudents } from "./step-students";
import { StepTeacher } from "./step-teacher";
import { StepTeam } from "./step-team";

const PHONE_PATTERN = /^(?:\+94|0)\d{9}$/u;
const EMAIL_PATTERN = /^[^@\s@]+@[^\s@]+\.[^@\s@]+$/u;
const USERNAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/u;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/u;
const REFERENCE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const MIN_PASSWORD_LENGTH = 8;

const isPhone = (value: string) =>
  PHONE_PATTERN.test(value.replaceAll(/[\s-]/gu, ""));

const isGradeAllowed = (division: Division | null, grade: string) =>
  division !== null && divisionGrades[division].includes(grade);

/** The API names the divisions differently to the wizard. */
const divisionToApi = (division: Division) =>
  division === "junior" ? "primary" : "secondary";

const validateAccount = (account: AccountDetails): AccountErrors => {
  const errors: AccountErrors = {};

  if (account.role === null) {
    errors.role = validationCopy.registrantRole;
  }
  if (account.fullName.trim().length === 0) {
    errors.fullName = validationCopy.required;
  }
  if (!EMAIL_PATTERN.test(account.email.trim())) {
    errors.email = validationCopy.email;
  }
  if (account.username.trim().length < 3) {
    errors.username = validationCopy.usernameLength;
  } else if (!USERNAME_PATTERN.test(account.username.trim())) {
    errors.username = validationCopy.username;
  }
  if (account.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = validationCopy.password;
  }
  if (account.nationalId.trim().length === 0) {
    errors.nationalId = validationCopy.required;
  }
  if (!DATE_PATTERN.test(account.birthday.trim())) {
    errors.birthday = validationCopy.birthday;
  }
  if (account.grade === null) {
    errors.grade = validationCopy.required;
  }

  return errors;
};

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

  if (key === "account") {
    const account = validateAccount(state.account);
    if (Object.keys(account).length > 0) {
      errors.account = account;
    }
  }

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
  const router = useRouter();
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
  const accountStep = stepOrder.indexOf("account");

  const handleAccountChange = (patch: Partial<AccountDetails>) => {
    setState((current) => ({
      ...current,
      account: { ...current.account, ...patch },
    }));
    setErrors((current) => ({ ...current, account: undefined }));
  };

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

  /** Create the leader's or MIC's account, then sign them in. */
  const createAccount = async (): Promise<boolean> => {
    const { account } = state;
    if (account.role === null || account.grade === null) {
      return false;
    }

    setPending(true);
    try {
      await orpc.access.register.call({
        fullName: account.fullName.trim(),
        email: account.email.trim(),
        username: account.username.trim(),
        password: account.password,
        nationalId: account.nationalId.trim(),
        birthday: account.birthday.trim(),
        grade: account.grade,
        role: account.role,
      });
    } catch (error) {
      setPending(false);
      setErrors({
        account: {
          username: messageFor(
            error,
            "We could not create that account. Try a different username."
          ),
        },
      });
      toast.error(messageFor(error, "We could not create your account"));
      return false;
    }
    setPending(false);

    const { error } = await authClient.signIn.username({
      username: account.username.trim(),
      password: account.password,
    });
    if (error) {
      toast.error("Account created, but sign-in failed. Please sign in.");
      await router.navigate({ to: "/auth/login" });
      return false;
    }
    return true;
  };

  /** Create the school (if new) and the team, with the caller as leader. */
  const submitTeam = async (): Promise<boolean> => {
    if (state.division === null) {
      return false;
    }

    setPending(true);
    try {
      await orpc.teams.register.call({
        teamName: state.team.name.trim(),
        division: divisionToApi(state.division),
        school: {
          name: state.school.name.trim(),
          city: state.school.district.trim(),
        },
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

    if (currentKey === "account") {
      const ok = await createAccount();
      if (!ok) {
        return;
      }
      toast.success("Account created");
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
    if (step === accountStep) {
      return registerAside.createAccountLabel;
    }
    return registerAside.continueLabel;
  })();

  const panels: Record<StepKey, ReactNode> = {
    account: (
      <StepAccount
        account={state.account}
        errors={errors.account ?? {}}
        onChange={handleAccountChange}
      />
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
        onEdit={handleSelect}
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
      <PageHero
        aside={
          <div className="flex flex-wrap gap-2">
            {registerHero.pills.map((pill) => (
              <Badge key={pill.label} tone={pill.tone}>
                {pill.label}
              </Badge>
            ))}
          </div>
        }
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Register" }]}
        id="register"
        kicker={registerHero.kicker}
        kickerTone="volt"
        title={registerHero.title}
      />

      <Section tone="base">
        <Container>
          <div className="flex flex-wrap items-start gap-5">
            <aside className="flex-[1_1_260px] lg:sticky lg:top-[100px]">
              <Card className="p-5">
                <p className="text-muted-2 font-mono text-[11px] tracking-[0.16em]">
                  STEP {step + 1} OF {stepOrder.length}
                </p>
                <ProgressMeter
                  className="mt-3.5"
                  max={stepOrder.length}
                  value={step + 1}
                />
                <Steps
                  className="mt-4 hidden min-[1100px]:grid"
                  current={step}
                  maxVisited={maxStep}
                  onSelect={handleSelect}
                  steps={stepList}
                />
                <p className="font-display mt-4 text-[16px] font-semibold min-[1100px]:hidden">
                  {content.label}
                </p>
              </Card>
            </aside>

            <div className="min-w-0 flex-[3_1_560px]">
              <Card className="rounded-2xl p-[clamp(22px,3.5vw,40px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                {isConfirmation ? null : (
                  <div className="mb-7">
                    <p className="text-volt font-mono text-[11px] tracking-[0.16em]">
                      {content.eyebrow}
                    </p>
                    <h2 className="font-display mt-3 text-[clamp(26px,3vw,36px)] leading-[1.02] tracking-[-0.03em]">
                      {content.title}
                    </h2>
                    <p className="text-muted-2 mt-2.5 text-[14.5px] leading-[1.6]">
                      {content.body}
                    </p>
                  </div>
                )}

                {panels[currentKey]}

                {submitted ? null : (
                  <div className="border-line-soft mt-7 flex items-center justify-between gap-3 border-t pt-5">
                    <Button
                      disabled={pending || step === 0}
                      onClick={handleBack}
                      variant="ghost"
                    >
                      {registerAside.backLabel}
                    </Button>
                    <Button
                      aria-busy={pending}
                      disabled={pending}
                      onClick={handleNext}
                    >
                      {advanceLabel}
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
};
