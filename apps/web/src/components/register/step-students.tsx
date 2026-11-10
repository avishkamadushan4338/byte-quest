import { cn } from "@byte-quest/ui/lib/utils";
import { StarIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { InputField, SelectField } from "@/components/site/design-fields";

import type {
  Division,
  MemberDetails,
  RegisterErrors,
  StudentErrors,
} from "./data";
import {
  divisionLabels,
  divisionOrder,
  allowedGradesForMember,
  gradeOptionsForMember,
  LEADER_INDEX,
  studentLabel,
} from "./data";

const BADGE_CLASS =
  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[13px]";
const CHIP_CLASS = `${BADGE_CLASS} cursor-pointer transition-colors duration-200`;
const CHIP_ACTIVE_STYLE = {
  background: "rgba(82,255,61,0.12)",
  border: "1px solid rgba(82,255,61,0.45)",
  color: "#52FF3D",
} as const;
const CHIP_IDLE_STYLE = {
  background: "transparent",
  border: "1px solid rgba(185,245,208,0.15)",
  color: "#8FA79C",
} as const;

const memberName = (member: MemberDetails, index: number): string =>
  member.fullName.trim() || studentLabel(index);

const initialsOf = (name: string): string =>
  name
    .trim()
    .split(/\s+/u)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

interface MemberCardProps {
  division: Division;
  errors: StudentErrors | undefined;
  index: number;
  member: MemberDetails;
  onChange: (patch: Partial<MemberDetails>) => void;
}

const MemberCard = ({
  division,
  errors,
  index,
  member,
  onChange,
}: MemberCardProps) => {
  const prefix = `student-${division}-${index}`;
  const gradeOptions = gradeOptionsForMember(division, member.minorAgeCategory);
  const isLeader = index === LEADER_INDEX;
  const handleMinorChange = (checked: boolean) => {
    const gradeStillAllowed = allowedGradesForMember(
      division,
      checked
    ).includes(member.grade ?? "");
    onChange({
      grade: gradeStillAllowed ? member.grade : null,
      minorAgeCategory: checked,
    });
  };

  return (
    <div className="bg-ink rounded-[16px] border border-[rgba(185,245,208,0.08)] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="font-display text-[16px] font-semibold">
          {memberName(member, index)}
        </span>
        {isLeader ? (
          <span className={BADGE_CLASS} style={CHIP_ACTIVE_STYLE}>
            <StarIcon size={14} weight="fill" />
            Team leader
          </span>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InputField
          error={errors?.fullName}
          id={`${prefix}-full-name`}
          label="Full name"
          onValueChange={(value) => onChange({ fullName: value })}
          placeholder="As in school records"
          surface="surface"
          value={member.fullName}
        />
        <SelectField
          error={errors?.grade}
          id={`${prefix}-grade`}
          label="Grade"
          onValueChange={(value) => onChange({ grade: value || null })}
          options={gradeOptions}
          surface="surface"
          value={member.grade ?? ""}
        />
        <InputField
          error={errors?.birthday}
          id={`${prefix}-birthday`}
          label="Birthday"
          onValueChange={(value) => onChange({ birthday: value })}
          surface="surface"
          type="date"
          value={member.birthday}
        />
        <InputField
          error={errors?.whatsapp}
          id={`${prefix}-whatsapp`}
          label="WhatsApp number"
          onValueChange={(value) => onChange({ whatsapp: value })}
          placeholder="07XXXXXXXX"
          surface="surface"
          type="tel"
          value={member.whatsapp}
        />
        {division === "senior" ? (
          <label className="text-muted flex cursor-pointer items-center gap-3 text-[14px] sm:col-span-2">
            <input
              checked={member.minorAgeCategory}
              className="accent-volt size-4 shrink-0"
              onChange={(event) => handleMinorChange(event.target.checked)}
              type="checkbox"
            />
            Minor age category participating
          </label>
        ) : null}
      </div>
    </div>
  );
};

interface RosterProps {
  division: Division;
  errors: Record<string, StudentErrors> | undefined;
  onMemberChange: (index: number, patch: Partial<MemberDetails>) => void;
  students: MemberDetails[];
}

const Roster = ({
  division,
  errors,
  onMemberChange,
  students,
}: RosterProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMember = students[activeIndex];

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2" role="tablist">
        {students.map((member, index) => {
          const selected = index === activeIndex;
          return (
            <button
              aria-selected={selected}
              className={cn(
                "flex min-w-[120px] flex-1 flex-col items-start gap-0.5 rounded-[14px] border px-3.5 py-2.5 text-left transition-colors duration-200",
                selected
                  ? "border-[#52FF3D] bg-[rgba(82,255,61,0.08)] text-[#52FF3D]"
                  : "border-[rgba(185,245,208,0.14)] bg-[#020807] text-[#B9C9C1]"
              )}
              key={`${division}-tab-${index}`}
              onClick={() => setActiveIndex(index)}
              role="tab"
              type="button"
            >
              <span className="font-display text-[15px] font-bold">
                {member.fullName.trim()
                  ? initialsOf(member.fullName)
                  : String(index + 1)}
              </span>
              <span className="text-muted-2 w-full truncate text-[13px]">
                {memberName(member, index)}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-muted-2 m-0 text-[13px]">
        Each tab shows the student&apos;s initials from their full name. Fill in
        the full name first; the tab updates as you type.
      </p>
      {activeMember ? (
        <MemberCard
          division={division}
          errors={errors?.[String(activeIndex)]}
          index={activeIndex}
          key={`${division}-${activeIndex}`}
          member={activeMember}
          onChange={(patch) => onMemberChange(activeIndex, patch)}
        />
      ) : null}
    </div>
  );
};

interface StepStudentsProps {
  divisions: Division[];
  errors: RegisterErrors;
  onApplyGradePreset: (division: Division) => void;
  onMemberChange: (
    division: Division,
    index: number,
    patch: Partial<MemberDetails>
  ) => void;
  students: Record<Division, MemberDetails[]>;
}

export const StepStudents = ({
  divisions,
  errors,
  onApplyGradePreset,
  onMemberChange,
  students,
}: StepStudentsProps) => {
  const activeDivisions = divisionOrder.filter((division) =>
    divisions.includes(division)
  );
  const showHeadings = activeDivisions.length > 1;

  return (
    <div className="grid gap-7">
      {activeDivisions.map((division) => (
        <div key={division}>
          {showHeadings ? (
            <div className="text-volt mb-3 font-mono text-[13px] tracking-[0.16em]">
              {divisionLabels[division].toUpperCase()}
            </div>
          ) : null}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-faint text-[14px]">
              Same grade for the whole team?
            </span>
            <button
              className={CHIP_CLASS}
              onClick={() => onApplyGradePreset(division)}
              style={CHIP_IDLE_STYLE}
              type="button"
            >
              Copy Student 1 grade to all
            </button>
          </div>
          <Roster
            division={division}
            errors={errors.students?.[division]}
            onMemberChange={(index, patch) =>
              onMemberChange(division, index, patch)
            }
            students={students[division]}
          />
        </div>
      ))}
    </div>
  );
};
