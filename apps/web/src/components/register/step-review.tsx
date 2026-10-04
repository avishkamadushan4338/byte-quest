import { DataItem, DataList } from "@byte-quest/ui/components/data-list";
import { CheckboxField } from "@byte-quest/ui/components/fields";
import { Button } from "@byte-quest/ui/primitives/button";
import type { ReactNode } from "react";

import type { RegisterErrors, RegisterState } from "./data";
import {
  consentCopy,
  divisionSummary,
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
  onEdit: (step: number) => void;
  state: RegisterState;
}

interface ReviewSection {
  key: string;
  title: string;
  step: number;
  items: ReactNode;
}

export const StepReview = ({
  errors,
  onConsentChange,
  onEdit,
  state,
}: StepReviewProps) => {
  const sections: ReviewSection[] = [
    {
      key: "school",
      title: reviewTitles.school,
      step: 0,
      items: (
        <>
          <DataItem label="School name" value={state.school.name} />
          <DataItem label="Province" value={state.school.province ?? ""} />
          <DataItem label="District or city" value={state.school.district} />
        </>
      ),
    },
    {
      key: "division",
      title: reviewTitles.division,
      step: 1,
      items: (
        <DataItem label="Division" value={divisionSummary(state.division)} />
      ),
    },
    {
      key: "team",
      title: reviewTitles.team,
      step: 2,
      items: (
        <>
          <DataItem label="Team name" value={state.team.name} />
          <DataItem
            label="Team size"
            value={teamSizeSummary(state.team.size)}
          />
          <DataItem label="Idea" value={state.team.idea} />
        </>
      ),
    },
    {
      key: "students",
      title: reviewTitles.students,
      step: 3,
      items: state.students.map((member, index) => (
        <DataItem
          key={String(index)}
          label={
            index === state.leaderIndex
              ? leaderLabel(index)
              : studentLabel(index)
          }
          value={memberSummary(member)}
        />
      )),
    },
    {
      key: "teacher",
      title: reviewTitles.teacher,
      step: 4,
      items: (
        <>
          <DataItem label="Teacher" value={state.teacher.name} />
          <DataItem label="Designation" value={state.teacher.designation} />
          <DataItem label="Phone" value={state.teacher.phone} />
          <DataItem label="Email" value={state.teacher.email} />
        </>
      ),
    },
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-2.5">
        {sections.map((section) => (
          <div
            className="border-line-soft bg-ink rounded-[14px] border p-4"
            key={section.key}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-muted-2 font-mono text-[11px] tracking-[0.16em]">
                {section.title}
              </span>
              <Button
                aria-label={`Edit ${section.title.toLowerCase()} section`}
                onClick={() => onEdit(section.step)}
                size="sm"
                variant="link"
              >
                {reviewEditLabel}
              </Button>
            </div>
            <DataList columns="minmax(min(100%,200px),1fr)">
              {section.items}
            </DataList>
          </div>
        ))}
      </div>

      <CheckboxField
        checked={state.consent}
        error={errors.consent}
        id="register-consent"
        label={consentCopy}
        onCheckedChange={onConsentChange}
      />
    </div>
  );
};
