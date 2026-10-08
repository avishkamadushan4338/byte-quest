import type { Division, RegisterErrors, RegisterState, StepKey } from "./data";
import {
  consentCopy,
  divisionLabels,
  divisionOrder,
  leaderLabel,
  memberSummary,
  reviewEditLabel,
  reviewTitles,
  studentLabel,
  teamSizeSummary,
} from "./data";

interface StepReviewProps {
  errors: RegisterErrors;
  onConsentChange: (checked: boolean) => void;
  onEdit: (step: StepKey) => void;
  state: RegisterState;
}

interface ReviewRow {
  label: string;
  value: string;
}

interface ReviewSection {
  key: string;
  title: string;
  step: StepKey;
  rows: ReviewRow[];
}

const EMPTY_VALUE = "-";

const buildSections = (state: RegisterState): ReviewSection[] => {
  const activeDivisions = divisionOrder.filter((division) =>
    state.divisions.includes(division)
  );
  const suffix = (division: Division) =>
    activeDivisions.length > 1
      ? ` · ${divisionLabels[division].split(" ·")[0]}`
      : "";

  const teamSections: ReviewSection[] = activeDivisions.map((division) => ({
    key: `team-${division}`,
    title: `${reviewTitles.team}${suffix(division)}`,
    step: "team",
    rows: [
      { label: "Team name", value: state.teams[division].name },
      {
        label: "Team size",
        value: teamSizeSummary(state.teams[division].size),
      },
      { label: "Idea", value: state.teams[division].idea },
    ],
  }));

  const studentSections: ReviewSection[] = activeDivisions.map((division) => ({
    key: `students-${division}`,
    title: `${reviewTitles.students}${suffix(division)}`,
    step: "students",
    rows: state.students[division].map((member, index) => ({
      label:
        index === state.leaderIndex[division]
          ? leaderLabel(index)
          : studentLabel(index),
      value: memberSummary(member),
    })),
  }));

  return [
    {
      key: "school",
      title: reviewTitles.school,
      step: "school",
      rows: [
        { label: "School", value: state.school.name },
        { label: "Province", value: state.school.province ?? "" },
        { label: "District / city", value: state.school.district },
      ],
    },
    {
      key: "division",
      title: reviewTitles.division,
      step: "division",
      rows: [
        {
          label: "Division",
          value: activeDivisions.map((d) => divisionLabels[d]).join(" + "),
        },
      ],
    },
    ...teamSections,
    ...studentSections,
    {
      key: "teacher",
      title: reviewTitles.teacher,
      step: "teacher",
      rows: [
        { label: "Teacher", value: state.teacher.name },
        { label: "Designation", value: state.teacher.designation },
        { label: "Phone", value: state.teacher.phone },
        { label: "Email", value: state.teacher.email },
      ],
    },
  ];
};

export const StepReview = ({
  errors,
  onConsentChange,
  onEdit,
  state,
}: StepReviewProps) => (
  <>
    <div className="grid gap-2.5">
      {buildSections(state).map((section) => (
        <div
          className="bg-ink rounded-[14px] border border-[rgba(185,245,208,0.08)] px-[18px] py-4"
          key={section.key}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-2 font-mono text-[10.5px] tracking-[0.14em]">
              {section.title}
            </span>
            <button
              aria-label={`Edit ${section.title.toLowerCase()} section`}
              className="text-volt cursor-pointer border-none bg-transparent p-0 font-mono text-[11px] tracking-[0.08em]"
              onClick={() => onEdit(section.step)}
              type="button"
            >
              {reviewEditLabel}
            </button>
          </div>
          <div className="mt-2.5 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-x-[18px] gap-y-2">
            {section.rows.map((row) => (
              <div className="min-w-0" key={row.label}>
                <div className="text-faint text-[11.5px]">{row.label}</div>
                <div className="text-fg-strong mt-0.5 text-[14px] [overflow-wrap:anywhere]">
                  {row.value.trim() || EMPTY_VALUE}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <label className="text-muted mt-[18px] flex cursor-pointer items-start gap-3 text-[13.5px] leading-[1.5]">
      <input
        checked={state.consent}
        className="accent-volt mt-[3px] size-4 shrink-0"
        onChange={(event) => onConsentChange(event.target.checked)}
        type="checkbox"
      />
      <span>{consentCopy}</span>
    </label>
    <div className="mt-1.5 min-h-4 text-[12px] text-[#FF8A7A]" role="alert">
      {errors.consent}
    </div>
  </>
);
