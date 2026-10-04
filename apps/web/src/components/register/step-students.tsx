import { SelectField, TextField } from "@byte-quest/ui/components/fields";
import { cn } from "@byte-quest/ui/lib/utils";
import { Button } from "@byte-quest/ui/primitives/button";

import type { Division, MemberDetails, RegisterErrors } from "./data";
import { gradeOptionsForDivision, studentLabel } from "./data";

interface StepStudentsProps {
  division: Division | null;
  errors: RegisterErrors;
  onLeaderChange: (index: number) => void;
  onMemberChange: (index: number, patch: Partial<MemberDetails>) => void;
  students: MemberDetails[];
  leaderIndex: number;
}

const memberChipClasses =
  "border-line-strong text-muted-2 flex size-7 shrink-0 items-center justify-center rounded-[8px] border bg-ink font-mono text-[11px]";

const leaderButtonClasses =
  "ml-auto h-auto px-3 py-1.5 font-mono text-[10.5px] tracking-[0.12em]";

export const StepStudents = ({
  division,
  errors,
  onLeaderChange,
  onMemberChange,
  students,
  leaderIndex,
}: StepStudentsProps) => {
  const gradeOptions = gradeOptionsForDivision(division);

  return (
    <div className="grid gap-3">
      {students.map((member, index) => {
        const isLeader = index === leaderIndex;
        const memberErrors = errors.students?.[String(index)];

        return (
          <div
            className={cn(
              "bg-ink rounded-2xl border p-4",
              isLeader ? "border-gold/30" : "border-line-soft"
            )}
            key={String(index)}
          >
            <div className="mb-3.5 flex items-center gap-3">
              <span className={memberChipClasses}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-fg text-[16px] font-semibold tracking-[-0.02em]">
                {studentLabel(index)}
              </span>
              <Button
                aria-pressed={isLeader}
                aria-label={`Make ${studentLabel(index)} the team leader`}
                className={cn(
                  leaderButtonClasses,
                  isLeader
                    ? "border-gold/45 bg-gold/12 text-gold-bright"
                    : "border-line-strong text-muted-2"
                )}
                onClick={() => onLeaderChange(index)}
                size="sm"
                variant="outline"
              >
                {isLeader ? "★ TEAM LEADER" : "MAKE LEADER"}
              </Button>
            </div>

            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-3">
              <TextField
                autoComplete="name"
                error={memberErrors?.fullName}
                id={`student-${index}-full-name`}
                label="Full name"
                onValueChange={(value) =>
                  onMemberChange(index, { fullName: value })
                }
                placeholder="As in school records"
                value={member.fullName}
              />
              <SelectField
                error={memberErrors?.grade}
                id={`student-${index}-grade`}
                label="Grade"
                onValueChange={(value) =>
                  onMemberChange(index, { grade: value })
                }
                options={gradeOptions}
                placeholder={
                  gradeOptions.length > 0
                    ? "Select grade"
                    : "Choose a division first"
                }
                value={member.grade}
              />
              <TextField
                id={`student-${index}-class`}
                label="Class"
                onValueChange={(value) =>
                  onMemberChange(index, { className: value })
                }
                placeholder="e.g. 10B"
                value={member.className}
              />
              <TextField
                id={`student-${index}-admission-number`}
                inputMode="numeric"
                label="Admission number"
                onValueChange={(value) =>
                  onMemberChange(index, { admissionNumber: value })
                }
                placeholder="e.g. 12345"
                value={member.admissionNumber}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
