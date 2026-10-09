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
  gradeOptionsForDivision,
  studentLabel,
} from "./data";

interface RosterProps {
  division: Division;
  errors: Record<string, StudentErrors> | undefined;
  onLeaderChange: (index: number) => void;
  onMemberChange: (index: number, patch: Partial<MemberDetails>) => void;
  students: MemberDetails[];
  leaderIndex: number;
}

const Roster = ({
  division,
  errors,
  onLeaderChange,
  onMemberChange,
  students,
  leaderIndex,
}: RosterProps) => {
  const gradeOptions = gradeOptionsForDivision(division);

  return (
    <div className="grid gap-3">
      {students.map((member, index) => {
        const isLeader = index === leaderIndex;
        const memberErrors = errors?.[String(index)];
        const prefix = `student-${division}-${index}`;

        return (
          <div
            className="bg-ink rounded-[16px] p-[18px]"
            key={prefix}
            style={{
              border: `1px solid ${isLeader ? "rgba(212,175,55,0.3)" : "rgba(185,245,208,0.08)"}`,
            }}
          >
            <div className="mb-3.5 flex items-center justify-between gap-3">
              <span className="flex items-center gap-2.5">
                <span className="text-volt flex size-7 items-center justify-center rounded-[8px] border border-[rgba(82,255,61,0.35)] font-mono text-[13px]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[16px] font-semibold">
                  {studentLabel(index)}
                </span>
              </span>
              <button
                aria-pressed={isLeader}
                className="cursor-pointer rounded-full px-3 py-1.5 font-mono text-[12.5px] tracking-[0.1em] whitespace-nowrap"
                onClick={() => onLeaderChange(index)}
                style={{
                  background: isLeader
                    ? "rgba(212,175,55,0.12)"
                    : "transparent",
                  color: isLeader ? "#F0D875" : "#8FA79C",
                  border: `1px solid ${isLeader ? "rgba(212,175,55,0.45)" : "rgba(185,245,208,0.15)"}`,
                }}
                type="button"
              >
                {isLeader ? "★ TEAM LEADER" : "MAKE LEADER"}
              </button>
            </div>
            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-x-3.5 gap-y-3">
              <InputField
                error={memberErrors?.fullName}
                id={`${prefix}-full-name`}
                label="Full name"
                onValueChange={(value) =>
                  onMemberChange(index, { fullName: value })
                }
                placeholder="As in school records"
                surface="surface"
                value={member.fullName}
              />
              <SelectField
                error={memberErrors?.grade}
                id={`${prefix}-grade`}
                label="Grade"
                onValueChange={(value) =>
                  onMemberChange(index, { grade: value || null })
                }
                options={gradeOptions}
                surface="surface"
                value={member.grade ?? ""}
              />
              <InputField
                error={memberErrors?.className}
                id={`${prefix}-class`}
                label="Class"
                onValueChange={(value) =>
                  onMemberChange(index, { className: value })
                }
                placeholder="e.g. 10B"
                surface="surface"
                value={member.className}
              />
              <InputField
                error={memberErrors?.admissionNumber}
                id={`${prefix}-admission-number`}
                label="Admission number"
                onValueChange={(value) =>
                  onMemberChange(index, { admissionNumber: value })
                }
                placeholder="e.g. 12345"
                surface="surface"
                value={member.admissionNumber}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface StepStudentsProps {
  divisions: Division[];
  errors: RegisterErrors;
  onLeaderChange: (division: Division, index: number) => void;
  onMemberChange: (
    division: Division,
    index: number,
    patch: Partial<MemberDetails>
  ) => void;
  students: Record<Division, MemberDetails[]>;
  leaderIndex: Record<Division, number>;
}

export const StepStudents = ({
  divisions,
  errors,
  onLeaderChange,
  onMemberChange,
  students,
  leaderIndex,
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
          <Roster
            division={division}
            errors={errors.students?.[division]}
            leaderIndex={leaderIndex[division]}
            onLeaderChange={(index) => onLeaderChange(division, index)}
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
