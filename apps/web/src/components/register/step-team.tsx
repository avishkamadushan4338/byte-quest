import { UserIcon } from "@phosphor-icons/react";

import { fieldGridClass, InputField } from "@/components/site/design-fields";

import type { Division, RegisterErrors, TeamDetails, TeamErrors } from "./data";
import { divisionLabels, divisionOrder, teamSizeHint } from "./data";

interface TeamFieldsProps {
  division: Division;
  error: TeamErrors | undefined;
  onChange: (patch: Partial<TeamDetails>) => void;
  onSizeChange: (size: string) => void;
  team: TeamDetails;
}

const TEAM_SIZE_MIN = 3;
const TEAM_SIZE_MAX = 5;

const TeamFields = ({
  division,
  error,
  onChange,
  onSizeChange,
  team,
}: TeamFieldsProps) => (
  <>
    <div className={fieldGridClass}>
      <InputField
        error={error?.leaderEmail}
        id={`team-leader-email-${division}`}
        label="Leader email"
        onValueChange={(value) => onChange({ leaderEmail: value })}
        placeholder="The leader receives the reference code here"
        requirement="required"
        type="email"
        value={team.leaderEmail}
      />
    </div>
    <div className="mt-1.5">
      <div
        className="text-fg-dim text-[14.5px] font-semibold"
        id={`team-size-label-${division}`}
      >
        Team size
      </div>
      <div
        aria-labelledby={`team-size-label-${division}`}
        className="mt-2.5 grid grid-cols-3 gap-2.5"
        role="radiogroup"
      >
        {Array.from(
          { length: TEAM_SIZE_MAX - TEAM_SIZE_MIN + 1 },
          (_, index) => TEAM_SIZE_MIN + index
        ).map((size) => {
          const selected = team.size === String(size);
          return (
            <label
              className="has-[:focus-visible]:outline-volt flex cursor-pointer flex-col items-center gap-3 rounded-[14px] px-3 py-3.5 transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px]"
              key={size}
              style={{
                background: selected ? "rgba(82,255,61,0.08)" : "#020807",
                border: `1px solid ${selected ? "#52FF3D" : "rgba(185,245,208,0.14)"}`,
                color: selected ? "#52FF3D" : "#B9C9C1",
              }}
            >
              <input
                checked={selected}
                className="sr-only"
                name={`team-size-${division}`}
                onChange={() => onSizeChange(String(size))}
                type="radio"
                value={size}
              />
              <span className="flex items-center">
                {Array.from({ length: size }, (_, index) => (
                  <span
                    aria-hidden="true"
                    className={`-ml-2 flex size-9 items-center justify-center rounded-full border-2 border-[#020807] first:ml-0 ${selected ? "bg-[#52FF3D] text-[#020807]" : "bg-[rgba(185,245,208,0.12)]"}`}
                    key={index}
                  >
                    <UserIcon size={18} weight="fill" />
                  </span>
                ))}
              </span>
              <span className="font-display text-[15px] font-bold">
                {size} students
              </span>
            </label>
          );
        })}
      </div>
      <div className="text-muted-2 mt-2 text-[14px]">{teamSizeHint}</div>
    </div>
  </>
);

interface StepTeamProps {
  divisions: Division[];
  errors: RegisterErrors;
  onChange: (division: Division, patch: Partial<TeamDetails>) => void;
  onSizeChange: (division: Division, size: string) => void;
  teams: Record<Division, TeamDetails>;
}

export const StepTeam = ({
  divisions,
  errors,
  onChange,
  onSizeChange,
  teams,
}: StepTeamProps) => {
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
          <TeamFields
            division={division}
            error={errors.teams?.[division]}
            onChange={(patch) => onChange(division, patch)}
            onSizeChange={(size) => onSizeChange(division, size)}
            team={teams[division]}
          />
        </div>
      ))}
    </div>
  );
};
