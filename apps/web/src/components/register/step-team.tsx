import {
  fieldGridClass,
  InputField,
  TextareaField,
} from "@/components/site/design-fields";

import type { RegisterErrors, TeamDetails } from "./data";
import { teamSizeHint, teamSizeOptions } from "./data";

interface StepTeamProps {
  errors: RegisterErrors;
  onChange: (patch: Partial<TeamDetails>) => void;
  onSizeChange: (size: string) => void;
  team: TeamDetails;
}

export const StepTeam = ({
  errors,
  onChange,
  onSizeChange,
  team,
}: StepTeamProps) => (
  <>
    <div className={fieldGridClass}>
      <InputField
        error={errors.team?.name}
        id="team-name"
        label="Team name"
        onValueChange={(value) => onChange({ name: value })}
        placeholder="Something memorable"
        requirement="required"
        value={team.name}
      />
      <TextareaField
        id="team-idea"
        label="Initial project idea"
        onValueChange={(value) => onChange({ idea: value })}
        placeholder="A sentence or two — this can change."
        requirement="optional"
        value={team.idea}
      />
    </div>
    <div className="mt-1.5">
      <div className="text-fg-dim text-[13px] font-semibold">Team size</div>
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
                name="team-size"
                onChange={() => onSizeChange(option.value)}
                type="radio"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      <div className="text-muted-2 mt-2 text-[12.5px]">{teamSizeHint}</div>
    </div>
  </>
);
