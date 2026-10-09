import {
  fieldGridClass,
  InputField,
  TextareaField,
} from "@/components/site/design-fields";

import type { Division, RegisterErrors, TeamDetails, TeamErrors } from "./data";
import {
  divisionLabels,
  divisionOrder,
  teamSizeHint,
  teamSizeOptions,
} from "./data";

interface TeamFieldsProps {
  division: Division;
  error: TeamErrors | undefined;
  onChange: (patch: Partial<TeamDetails>) => void;
  onSizeChange: (size: string) => void;
  team: TeamDetails;
}

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
        error={error?.name}
        id={`team-name-${division}`}
        label="Team name"
        onValueChange={(value) => onChange({ name: value })}
        placeholder="Something memorable"
        requirement="required"
        value={team.name}
      />
      <TextareaField
        id={`team-idea-${division}`}
        label="Initial project idea"
        onValueChange={(value) => onChange({ idea: value })}
        placeholder="A sentence or two - this can change."
        requirement="optional"
        value={team.idea}
      />
    </div>
    <div className="mt-1.5">
      <div className="text-fg-dim text-[14.5px] font-semibold">Team size</div>
      <div
        aria-label="Team size"
        className="mt-2.5 flex gap-2"
        role="radiogroup"
      >
        {teamSizeOptions.map((option) => {
          const selected = team.size === option.value;
          return (
            <label
              className="font-display has-[:focus-visible]:outline-volt w-[72px] cursor-pointer rounded-[12px] py-3.5 text-center text-[22px] font-bold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px]"
              key={option.value}
              style={{
                background: selected ? "#52FF3D" : "#020807",
                color: selected ? "#020807" : "#B9C9C1",
                border: `1px solid ${selected ? "#52FF3D" : "rgba(185,245,208,0.14)"}`,
              }}
            >
              <input
                aria-label={`${option.value} students`}
                checked={selected}
                className="sr-only"
                name={`team-size-${division}`}
                onChange={() => onSizeChange(option.value)}
                type="radio"
              />
              {option.label}
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
